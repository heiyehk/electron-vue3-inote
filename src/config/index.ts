import { classNames } from './inotesConfig';
import { browserWindowOption, winURL, disabledKeys, userTasks } from './electronConfig';

const isDev = process.env.NODE_ENV === 'development';

/** 日志地址 */
const constErrorLogPath = `/resources/inotesError${isDev ? '-dev' : ''}.log`;

/** db地址 */
const constStoragePath = `/resources/db/notes${isDev ? '-dev' : ''}.db`;

export {
  classNames,
  browserWindowOption,
  winURL,
  disabledKeys,
  userTasks,
  constErrorLogPath,
  constStoragePath
};
