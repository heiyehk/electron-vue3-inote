import { Model } from 'sequelize';

/**
 * model需要的类型
 */
export interface NotesModelType {
  uid: string;
  className: string;
  content: string;
  interception: string;
}

/**
 * 数据库返回的数据类型
 */
export interface DBNotesType {
  readonly uid: string;
  className: string;
  content: string;
  interception: string;
  readonly createdAt: Date;
  updatedAt: Date;
}

/**
 * 列表中的
 *
 * remove 是否已删除
 */
export interface DBNotesListType extends DBNotesType {
  remove?: boolean;
}

/**
 * typescript创建model写法
 * https://stackoverflow.com/questions/60014874/how-to-use-typescript-with-sequelize
 */
export interface NotesModel extends Model<NotesModelType>, NotesModelType {}
