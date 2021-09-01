import { sequelize } from '../initSequelize';
import { STRING } from 'sequelize';
import { NotesModel } from '@/types/notes';
import { uuid } from '@/utils';

export const Notes = sequelize.define<NotesModel>(
  'notes',
  {
    uid: {
      type: STRING,
      primaryKey: true,
      defaultValue: uuid(),
      allowNull: false,
      /**
       * 是否可重复
       */
      unique: false
    },
    className: STRING(32),
    content: STRING(9999999),
    interception: STRING(500)
  },
  {
    timestamps: true
  }
);

Notes.sync({
  alter: true
});
