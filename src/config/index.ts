import { classNames } from './inotesConfig';
import { browserWindowOption, winURL, disabledKeys, userTasks } from './electronConfig';

const isDev = process.env.NODE_ENV === 'development';

/** 日志地址 */
const constErrorLogPath = `/resources/inotesError${isDev ? '-dev' : ''}.log`;

/** db地址 */
const constStoragePath = `/resources/db/notes${isDev ? '-dev' : ''}.db`;

/** 图片地址 */
const constImagesPath = '/resources/images/';

export {
  classNames,
  browserWindowOption,
  winURL,
  disabledKeys,
  userTasks,
  constErrorLogPath,
  constStoragePath,
  constImagesPath
};
