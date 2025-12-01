type AnyFunc = (...args: ReadonlyArray<any>) => any;
const debounce = <T extends AnyFunc>(
  func: T,
  delay: number,
): ((...args: Parameters<T>) => void) & {
  clear: () => void;
} => {
  let timer: any;
  const wrapper = (...args: ReadonlyArray<any>) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, delay);
  };
  wrapper.clear = () => {
    clearTimeout(timer);
  };
  return wrapper;
};
export default debounce;
