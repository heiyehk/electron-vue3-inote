import { Model } from 'sequelize';

interface Note {
  uid: string;
  content: string;
  className: string;
}

/**
 * typescript创建model写法
 * https://stackoverflow.com/questions/60014874/how-to-use-typescript-with-sequelize
 */
interface INoteModel extends Model<Note>, Note {}
