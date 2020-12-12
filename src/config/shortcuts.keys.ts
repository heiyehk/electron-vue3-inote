/**
 * 主要禁用
 * - F11 禁用全屏放大
 * - CTRL+R 禁用刷新
 * - CTRL+SHIFT+R 禁用刷新
 */
const devShortcuts = ['F11', 'Ctrl+R', 'Ctrl+SHIFT+R'];

const shortcuts = ['Ctrl+N', 'SHIFT+F10', 'Ctrl+SHIFT+I'];

const exportKeys = process.env.NODE_ENV === 'development' ? shortcuts : [...devShortcuts, ...shortcuts];

export default exportKeys;
