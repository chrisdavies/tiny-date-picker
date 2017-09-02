/* global expect */
import Emitter from '../src/lib/emitter';

describe('Emitter', () => {
  it('emits events', () => {
    const emitter = Emitter();
    let count = 0;
    emitter.on('hi', (_, x) => count = x);
    emitter.emit('hi', 42);
    expect(count).toEqual(42);
  });

  it('can have multiple handlers', () => {
    const emitter = Emitter();
    const words = [];
    emitter.on('yo', (_, s) => words[0] = s);
    emitter.on('yo', (_, s) => words[1] = s);
    emitter.emit('yo', 'hoi');
    expect(words).toEqual(['hoi', 'hoi']);
  });

  it('can take a hash table of handlers', () => {
    const emitter = Emitter();
    let one = 0;
    let two = 0;

    emitter.on({
      one: () => ++one,
      two: () => ++two,
    });

    emitter.emit('one');
    emitter.emit('two');
    emitter.emit('two');

    expect(one).toEqual(1);
    expect(two).toEqual(2);
  });

  it('can unregister a single handler', () => {
    const emitter = Emitter();
    const words = [];
    const h1 = (_, s) => words[0] = s;
    const h2 = (_, s) => words[1] = s;
    emitter.on('yo', h1);
    emitter.on('yo', h2);
    emitter.off('yo', h1);
    emitter.emit('yo', 'hoi');
    expect(words).toEqual([undefined, 'hoi']);
  });

  it('can unregister all handlers of a certain event', () => {
    const emitter = Emitter();
    let yo = 0;
    let hi = 0;

    emitter.on('yo', () => ++yo);
    emitter.on('yo', () => ++yo);
    emitter.on('hi', () => ++hi);

    emitter.emit('yo');
    emitter.emit('hi');

    expect(yo).toEqual(2);
    expect(hi).toEqual(1);

    emitter.off('yo');

    emitter.emit('yo');
    emitter.emit('hi');

    expect(yo).toEqual(2);
    expect(hi).toEqual(2);
  });

  it('can unregister all handlers of all events', () => {
    const emitter = Emitter();
    let yo = 0;
    let hi = 0;

    emitter.on('yo', () => ++yo);
    emitter.on('yo', () => ++yo);
    emitter.on('hi', () => ++hi);

    emitter.emit('yo');
    emitter.emit('hi');

    expect(yo).toEqual(2);
    expect(hi).toEqual(1);

    emitter.off();

    emitter.emit('yo');
    emitter.emit('hi');

    expect(yo).toEqual(2);
    expect(hi).toEqual(1);
  });
});
