/**
 * 储存数据库的
 */
interface DBNotes {
  className: string;
  content: string;
  readonly createdAt: Date;
  readonly uid: string;
  updatedAt: Date;
  readonly _id: string;
}

/**
 * 列表中的
 * @argument remove 是否删除
 */
interface ListDbNotes extends DBNotes {
  remove?: boolean;
}

type QueryDB<T> = {
  [K in keyof T]?: T[K];
};
