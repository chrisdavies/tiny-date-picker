/* global expect */
import {
  now,
  datesEq,
  shiftDay,
  shiftMonth,
  shiftYear,
  setYear,
  setMonth,
  dateOrParse,
  constrainDate
} from '../src/lib/date-manip';

describe('date-manip', () => {
  const sToDt = (s) => new Date(s);

  describe('now', () => {
    it('does not have time', () => {
      const dt = now();
      expect(dt.getHours()).toEqual(0);
      expect(dt.getMinutes()).toEqual(0);
      expect(dt.getSeconds()).toEqual(0);
      expect(dt.getMilliseconds()).toEqual(0);
    });

    it('is today', () => {
      expect(now().toDateString()).toEqual(new Date().toDateString());
    });
  });

  describe('datesEq', () => {
    it('does not care about time', () => {
      expect(datesEq(now(), new Date())).toBeTruthy();
    });

    it('handles nulls', () => {
      expect(datesEq()).toBeTruthy();
      expect(datesEq(now())).toBeFalsy();
    });
  });

  describe('shiftDay', () => {
    it('does not mutate the date', () => {
      const dt = now();
      const tomorrow = shiftDay(dt, 1);

      expect(datesEq(dt, tomorrow)).toBeFalsy();
    });

    it('shifts forward in time', () => {
      const dt = sToDt('1/2/2010');
      const tomorrow = shiftDay(dt, 1);
      expect(tomorrow).toEqual(sToDt('1/3/2010'));
    });

    it('shifts backward in time', () => {
      const dt = sToDt('1/2/2010');
      const tenDaysAgo = shiftDay(dt, -10);
      expect(tenDaysAgo).toEqual(sToDt('12/23/2009'));
    });
  });

  describe('shiftMonth', () => {
    it('does not mutate the date', () => {
      const dt = now();
      const nextMonth = shiftMonth(dt, 1);

      expect(dt).not.toEqual(nextMonth);
    });

    it('shifts forward', () => {
      const dt = sToDt('1/2/1999');
      const nextMonth = shiftMonth(dt, 2);

      expect(nextMonth).toEqual(sToDt('3/2/1999'));
    });

    it('shifts backward past year', () => {
      const dt = sToDt('1/2/1999');
      const nextMonth = shiftMonth(dt, -3);

      expect(nextMonth).toEqual(sToDt('10/2/1998'));
    });

    it('does not shift year if told not to', () => {
      const dt = sToDt('1/2/1999');
      const nextMonth = shiftMonth(dt, -3, true);

      expect(nextMonth).toEqual(sToDt('10/2/1999'));
    });

    it('handles month end 31 to 30', () => {
      const dt = sToDt('5/31/2017');
      const nextMonth = shiftMonth(dt, 1);

      expect(nextMonth).toEqual(sToDt('6/30/2017'));
    });

    it('handles month end back from 31 to 28', () => {
      const dt = sToDt('3/31/2018');
      const nextMonth = shiftMonth(dt, -1);

      expect(nextMonth).toEqual(sToDt('2/28/2018'));
    });

    it('handles month end back from 31 to 30', () => {
      const dt = sToDt('5/31/2018');
      const nextMonth = shiftMonth(dt, -1);

      expect(nextMonth).toEqual(sToDt('4/30/2018'));
    });
  });

  describe('shiftYear', () => {
    it('does not mutate the date', () => {
      const dt = now();
      const tomorrow = shiftYear(dt, 1);

      expect(datesEq(dt, tomorrow)).toBeFalsy();
    });

    it('shifts forward in time', () => {
      const dt = sToDt('3/4/2005');
      const next = shiftYear(dt, 1);
      expect(next).toEqual(sToDt('3/4/2006'));
    });

    it('shifts backward in time', () => {
      const dt = sToDt('3/4/2005');
      const next = shiftYear(dt, -5);
      expect(next).toEqual(sToDt('3/4/2000'));
    });
  });

  describe('setYear', () => {
    it('does not mutate the date', () => {
      const dt = now();
      const next = setYear(dt, 2010);

      expect(datesEq(dt, next)).toBeFalsy();
    });

    it('sets the year', () => {
      const dt = sToDt('3/4/2005');
      const next = setYear(dt, 2011);
      expect(next).toEqual(sToDt('3/4/2011'));
    });
  });

  describe('setMonth', () => {
    it('does not mutate the date', () => {
      const dt = now();
      const next = setMonth(dt, 3);

      expect(datesEq(dt, next)).toBeFalsy();
    });

    it('sets the month', () => {
      const dt = sToDt('3/4/2005');
      const next = setMonth(dt, 8); // zero-based
      expect(next).toEqual(sToDt('9/4/2005'));
    });

    it('handles month end 31 to 30', () => {
      const dt = sToDt('5/31/2017');
      const nextMonth = setMonth(dt, 5);

      expect(nextMonth).toEqual(sToDt('6/30/2017'));
    });

    it('handles month end back from 31 to 28', () => {
      const dt = sToDt('3/31/2018');
      const nextMonth = setMonth(dt, 1);

      expect(nextMonth).toEqual(sToDt('2/28/2018'));
    });

    it('handles month end back from 31 to 30', () => {
      const dt = sToDt('5/31/2018');
      const nextMonth = setMonth(dt, 3);

      expect(nextMonth).toEqual(sToDt('4/30/2018'));
    });
  });

  describe('dateOrParse', () => {
    it('handles dates', () => {
      const toDt = dateOrParse(sToDt);
      const dt = now();

      expect(dt).toEqual(toDt(dt));
    });

    it('handles strings', () => {
      const toDt = dateOrParse(sToDt);
      const dt = sToDt('1/2/2003');

      expect(dt).toEqual(toDt('1/2/2003'));
    });
  });

  describe('constrainDate', () => {
    it('does not change the date if in range', () => {
      const dt = sToDt('1/2/2003');
      const min = sToDt('1/1/2003');
      const max = sToDt('1/1/2020');

      expect(dt).toEqual(constrainDate(dt, min, max));
    });

    it('gives min if dt is too small', () => {
      const dt = sToDt('1/2/2003');
      const min = sToDt('2/1/2003');
      const max = sToDt('1/1/2020');

      expect(min).toEqual(constrainDate(dt, min, max));
    });

    it('gives max if dt is too big', () => {
      const dt = sToDt('1/2/2033');
      const min = sToDt('2/1/2003');
      const max = sToDt('1/1/2020');

      expect(max).toEqual(constrainDate(dt, min, max));
    });
  });
});
