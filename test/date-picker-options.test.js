/* global expect */
import DatePickerOptions from '../src/date-picker-options';

describe('DatePickerOptions', () => {
  it('lang defaults to english', () => {
    const opts = DatePickerOptions();
    expect(opts.lang.close).toEqual('Close');
    expect(opts.lang.days).toEqual(
      ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    );
    expect(opts.lang.months).toEqual([
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ]);
  });

  it('allows overriding some lang props', () => {
    const opts = DatePickerOptions({
      lang: {close: 'X'}
    });
    expect(opts.lang.close).toEqual('X');
    expect(opts.lang.today).toEqual('Today');
    expect(opts.lang.clear).toEqual('Clear');
  });

  it('defaults min/max to roughly 100 years', () => {
    const opts = DatePickerOptions();
    const dt = new Date();

    expect(opts.min.getFullYear()).toBeLessThan(dt.getFullYear() - 99);
    expect(opts.min.getFullYear()).toBeGreaterThan(dt.getFullYear() - 101);

    expect(opts.max.getFullYear()).toBeGreaterThan(dt.getFullYear() + 99);
    expect(opts.max.getFullYear()).toBeLessThan(dt.getFullYear() + 101);
  });

  it('includes min/max in custom inRange function', () => {
    const opts = DatePickerOptions({
      min: '10/20/2000',
      max: '10/20/2010',
      inRange: (d) => d.getFullYear() !== 2001,
    });

    expect(opts.inRange(new Date('10/20/2000'))).toBeTruthy();
    expect(opts.inRange(new Date('10/20/2010'))).toBeTruthy();
    expect(opts.inRange(new Date('10/21/2010'))).toBeFalsy();
    expect(opts.inRange(new Date('10/19/2000'))).toBeFalsy();
    expect(opts.inRange(new Date('10/19/2001'))).toBeFalsy();
    expect(opts.inRange(new Date('10/19/2002'))).toBeTruthy();
  });

  it('formats date w/ American english style by default', () => {
    const opts = DatePickerOptions();

    expect(opts.format(new Date('2017-09-07T22:44:23.163Z')))
      .toEqual('9/7/2017');
  });

  it('parses dates using the default date constructor', () => {
    const opts = DatePickerOptions();

    expect(opts.parse('9/7/2017').getFullYear()).toEqual(2017);
    expect(opts.parse('10/2/2017').getDate()).toEqual(2);
    expect(opts.parse('11/2/2017').getMonth()).toEqual(10);
  });
});
