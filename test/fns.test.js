/* global expect */
import {bufferFn} from '../src/lib/fns';

describe('bufferFn', () => {
  it('only runs once within a window of time', () => {
    return new Promise((resolve, reject) => {
      let count = 0;
      const f = bufferFn(1, () => ++count);

      f();
      f();
      f();

      expect(count).toEqual(0);

      setTimeout(() => {
        try {
          expect(count).toEqual(1);
          resolve();
        } catch (err) {
          reject(err);
        }
      }, 5);
    });
  });

  it('only runs twice if called outside of the window', () => {
    return new Promise((resolve, reject) => {
      let count = 0;
      const f = bufferFn(1, () => ++count);

      f();
      f();
      f();

      expect(count).toEqual(0);

      setTimeout(() => {
        f();
        f();
        f();
      }, 10);

      setTimeout(() => {
        try {
          expect(count).toEqual(2);
          resolve();
        } catch (err) {
          reject(err);
        }
      }, 15);
    });
  });
});
