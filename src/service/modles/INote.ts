import { sequelize } from './initSequelize';
import { STRING } from 'sequelize';
import { INoteModel } from '@/types/inote';

export const INote = sequelize.define<INoteModel>(
  'inote',
  {
    uid: STRING,
    className: STRING,
    content: STRING
  },
  {
    timestamps: true
  }
);

INote.sync();
