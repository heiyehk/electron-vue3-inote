import Datastore from 'nedb';
import path from 'path';
import { remote } from 'electron';

type BackPromise<CB> = Promise<CB | null>;

/**
 * @see https://www.npmjs.com/package/nedb
 */
class INoteDB<G = any> {
  /**
   * 默认储存位置
   * C:\Users\{Windows User Name}\AppData\Roaming\i-notes
   */
  // dbPath = path.join(remote.app.getPath('userData'), 'db/inote.db');
  // dbPath = './db/inote.db';
  dbPath = this.path;

  _db: Datastore<Datastore.DataStoreOptions> = this.backDatastore;

  get path() {
    if (process.env.NODE_ENV === 'development') {
      return path.join(__dirname, 'db/inote.db');
    }
    return path.join(remote.app.getPath('userData'), 'db/inote.db');
  }

  get backDatastore() {
    return new Datastore({
      /**
       * autoload
       * default: false
       * 当数据存储被创建时，数据将自动从文件中加载到内存，不必去调用loadDatabase
       * 注意所有命令操作只有在数据加载完成后才会被执行
       */
      autoload: true,
      filename: this.dbPath,
      timestampData: true
    });
  }

  refreshDB() {
    this._db = this.backDatastore;
  }

  /**
   *
   * @param fieldName fieldName(必须): 索引字段，使用“.”给嵌套的字段加索引。
   * @param unique(可选，默认false): 字段唯一性约束。
   * 注意：唯一性约束会增加为两个文档中没有定义的字段添加索引的错误。
   * @param sparse(可选，默认false): 不能为没有定义的字段加索引。
   * 如果接受给多个文档中没有定义的字段添加索引，给需要该配置参数与unique一起使用。
   * @param expireAfterSeconds(可选，秒数): TTL索引，设置自动过期时间。
   * @param 删除索引： db.removeIndex(fieldName, cb)
   * 注意：_id字段会自动加索引和唯一性约束，不必再为它使用ensureIndex。
   * 如果使用本地存储，索引也将保存在数据文件中，当第二次加载数据库时，索引也将自动被添加。
   * 如果加载一个已经有索引的数据库，删除索引将不起任何作用。
   */
  initEnsureIndex(fieldName = 'uid'): void {
    this._db.ensureIndex({ fieldName, unique: true }, (error: Error | null) => {
      if (error) console.error(error);
    });
  }

  insert<T extends G>(doc: T): BackPromise<T> {
    return new Promise((resolve: (value: T) => void) => {
      this._db.insert(doc, (error: Error | null, document: T) => {
        if (!error) resolve(document);
      });
    }).catch(err => {
      console.error(err.message);
      return null;
    });
  }

  /**
   * db.find(query)
   * @param {T} query： object类型，查询条件，可以使用空对象{}。
   * 支持使用比较运算符($lt, $lte, $gt, $gte, $in, $nin, $ne)
   * 逻辑运算符($or, $and, $not, $where)
   * 正则表达式进行查询。
   */
  find<T extends G>(query: T): BackPromise<T[]> {
    return new Promise((resolve: (value: T[]) => void) => {
      this._db.find(query, (error: Error | null, document: T[]) => {
        if (!error) resolve(document);
      });
    }).catch(err => {
      console.error(err.message);
      return null;
    });
  }

  /**
   * db.findOne(query)
   * @param query
   */
  findOne(query: Record<string, any>) {
    return new Promise((resolve: (value: DBNotes) => void) => {
      this._db.findOne(query, (error: Error | null, document) => {
        if (!error) resolve(document as DBNotes);
      });
    }).catch(err => {
      console.error(err.message);
      return null;
    });
  }

  /**
   * db.remove(query, options)
   * @param {T} query
   * @param {Nedb.RemoveOptions} options
   * @return {BackPromise<number>}
   */
  remove<T extends G>(query: T, options?: Nedb.RemoveOptions) {
    return new Promise((resolve: (value: number) => void) => {
      if (options) {
        this._db.remove(query, options, (error: Error | null, n: number) => {
          if (!error) resolve(n);
        });
      } else {
        this._db.remove(query, (error: Error | null, n: number) => {
          if (!error) resolve(n);
        });
      }
    }).catch(err => {
      console.error(err.message);
      return null;
    });
  }

  update<T extends G>(query: T, updateQuery: T, options: Nedb.UpdateOptions = {}): BackPromise<T> {
    return new Promise((resolve: (value: T) => void) => {
      this._db.update(
        query,
        updateQuery,
        options,
        (error: Error | null, numberOfUpdated: number, affectedDocuments: T) => {
          if (!error) resolve(affectedDocuments);
        }
      );
    }).catch(err => {
      console.error(err.message);
      return null;
    });
  }
}

export default new INoteDB();
