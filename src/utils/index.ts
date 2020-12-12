export default class {
  // eslint-disable-next-line @typescript-eslint/ban-types
  debounce(fn: Function, delay = 1000): () => void {
    let timer: NodeJS.Timeout | null = null;
    return (...args: any) => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        fn.apply(this, args);
      }, delay);
    };
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  throttle(fn: Function, delay = 500): () => void {
    let flag = true;
    return (...args: any) => {
      if (!flag) return;
      flag = false;
      setTimeout(() => {
        fn.apply(this, args);
        flag = true;
      }, delay);
    };
  }
}
