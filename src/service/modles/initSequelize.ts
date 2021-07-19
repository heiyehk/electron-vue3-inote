import { Sequelize } from 'sequelize';
import sqlite3 from 'sqlite3';

export const sequelize = new Sequelize({
  database: 'reading',
  dialect: 'sqlite',
  storage: '@/../resources/db/note.db',
  dialectModule: sqlite3,
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

export const sequelizeInit = (): void => {
  console.log('-----------------------------------------------------------------');
  sequelize
    .authenticate()
    .then(() => {
      console.clear();
      console.log('Connection has been established successfully.');
    })
    .catch(err => {
      console.log('Unable to connect to the database', err);
    });

  // 根据 model自动创建表
  sequelize
    .sync()
    .then(() => {
      console.log('init db ok');
    })
    .catch(err => {
      console.log('init db error', err);
    });
};
