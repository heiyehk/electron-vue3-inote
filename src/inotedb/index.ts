import Datastore from 'nedb';
import path from 'path';
import { remote } from 'electron';

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

  insert<T extends G>(doc: T) {
    return new Promise((resolve: (value: T) => void) => {
      this._db.insert(doc, (error: Error | null, document: T) => {
        if (!error) resolve(document);
      });
    });
  }

  /**
   * db.find(query)
   * @param {Query<T>} query： object类型，查询条件，可以使用空对象{}。
   * 支持使用比较运算符($lt, $lte, $gt, $gte, $in, $nin, $ne)
   * 逻辑运算符($or, $and, $not, $where)
   * 正则表达式进行查询。
   */
  find(query: QueryDB<DBNotes>) {
    return new Promise((resolve: (value: DBNotes[]) => void) => {
      this._db.find(query, (error: Error | null, document: DBNotes[]) => {
        if (!error) resolve(document as DBNotes[]);
      });
    });
  }

  /**
   * db.findOne(query)
   * @param query
   */
  findOne(query: QueryDB<DBNotes>) {
    return new Promise((resolve: (value: DBNotes) => void) => {
      this._db.findOne(query, (error: Error | null, document) => {
        if (!error) resolve(document as DBNotes);
      });
    });
  }

  /**
   * db.remove(query, options)
   * @param {Record<keyof DBNotes, any>} query
   * @param {Nedb.RemoveOptions} options
   * @return {BackPromise<number>}
   */
  remove(query: QueryDB<DBNotes>, options?: Nedb.RemoveOptions) {
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
    });
  }

  update<T extends G>(query: T, updateQuery: T, options: Nedb.UpdateOptions = {}) {
    return new Promise((resolve: (value: T) => void) => {
      this._db.update(
        query,
        updateQuery,
        options,
        (error: Error | null, numberOfUpdated: number, affectedDocuments: T) => {
          if (!error) resolve(affectedDocuments);
        }
      );
    });
  }
}

export default new INoteDB();
