'use strict';
/* global browser */

describe('TinyDatePicker', function() {
  beforeEach(() => browser.url('/test'));

  it('Should show the modal when the modal input gains focus', function () {
    showModal();
  });

  it('Should call onOpen when opened', function () {
    inject('<input type="text" class="on-open-test" />');
    const html = `
      TinyDatePicker(document.querySelector('.on-open-test'), {
        onOpen: function() {
          window.onOpenFired = true;
        }
      });
    `;
    browser.execute((html) => new Function(html)(), html);
    showModalByClick('.on-open-test');
    assert.ok(browser.execute(() => window.onOpenFired));
  });

  it('Should allow manual closing', function () {
    inject('<input type="text" class="manual-close-test" />');
    const html = `
      window.dpManualCloseTest = TinyDatePicker(document.querySelector('.manual-close-test'));
    `;
    browser.execute((h) => new Function(h)(), html);
    showModalByClick('.manual-close-test');
    browser.execute((h) => new Function(h)(), 'dpManualCloseTest.close();');
    modalShouldHide();
  });

  it('Should remove all handlers on destroy', function () {
    inject('<input type="text" class="destroy-test" />');
    const html = `
      var dp = TinyDatePicker(document.querySelector('.destroy-test'));
      dp.destroy();
    `;
    browser.execute((h) => new Function(h)(), html);
    assert.isFalse(browser.isExisting('.dp-modal'));
    setFocus('.destroy-test');
    modalShouldHide();
  });

  it('Should not require a class', function () {
    inject('<input type="text" data-test="noclass" />');
    const html = `
      TinyDatePicker(document.querySelector('[data-test]'));
    `;
    browser.execute((html) => new Function(html)(), html);
    showModalByClick('[data-test]');
  });

  it('Should call onSelectYear when year is selected', function () {
    inject('<input type="text" value="12/9/2014" class="on-select-year-test" />');
    const html = `
      TinyDatePicker(document.querySelector('.on-select-year-test'), {
        onSelectYear: function(ctx) {
          window.yearWas = ctx.currentDate.getFullYear();
        }
      });
    `;

    browser.execute((html) => new Function(html)(), html);
    showModalByClick('.on-select-year-test');
    browser.click('.dp-cal-year');
    browser.execute(() => Array.prototype.slice.call(document.querySelectorAll('.dp-year'))
      .filter(el => el.textContent === '2016')
      .forEach(el => el.click()));
    assert.equal(browser.execute(() => window.yearWas).value, 2016);
  });

  it('Should call onSelectMonth when month is selected', function () {
    inject('<input type="text" value="12/9/2014" class="on-select-month-test" />');
    const html = `
      TinyDatePicker(document.querySelector('.on-select-month-test'), {
        onSelectMonth: function(ctx) {
          window.monthWas = ctx.currentDate.getMonth();
        }
      });
    `;

    browser.execute((html) => new Function(html)(), html);
    showModalByClick('.on-select-month-test');
    browser.click('.dp-cal-month');
    browser.click('[data-month="6"]');
    assert.equal(browser.execute(() => window.monthWas).value, 6);
  });

  it('Should show the modal when open is called', function () {
    inject('<input type="text" value="12/9/2014" class="open-test" />');
    const html = `
      TinyDatePicker(document.querySelector('.open-test')).open();
    `;

    browser.execute((html) => new Function(html)(), html);
    assert.isTrue(browser.isExisting('.dp-modal'));
  });

  it('Should show the years when openYears is called', function () {
    inject('<input type="text" value="12/9/2014" class="open-test" />');
    const html = `
      TinyDatePicker(document.querySelector('.open-test')).openYears();
    `;

    browser.execute((html) => new Function(html)(), html);
    assert.isTrue(browser.isExisting('.dp-modal'));
    assert.isTrue(browser.isExisting('.dp-year'));
  });

  it('Should show the months when openMonths is called', function () {
    inject('<input type="text" value="12/9/2014" class="open-test" />');
    const html = `
      TinyDatePicker(document.querySelector('.open-test')).openMonths();
    `;

    browser.execute((html) => new Function(html)(), html);
    assert.isTrue(browser.isExisting('.dp-modal'));
    assert.isTrue(browser.isExisting('.dp-month'));
  });

  it('Should hide the modal when the modal input re-gains focus', function () {
    showModal();
    setFocus('.modal-txt');
    modalShouldHide();
  });

  it('Should hide the modal when close is clicked', function () {
    showModal();
    browser.click('.dp-close');
    modalShouldHide();
    assert.isEmpty(browser.getValue('.modal-txt'));
  });

  it('Should select today when today is clicked', function () {
    showModal();
    browser.click('.dp-today');
    modalShouldHide();
    assert.isTrue(browser.hasFocus('.modal-txt'));
    assert.equal(browser.getValue('.modal-txt'), new Date().toLocaleDateString());
  });

  it('Should clear the date field when clear is clicked', function () {
    browser.execute(() => document.querySelector('.modal-txt').value = '10/20/2016');
    showModal();
    browser.click('.dp-clear');
    modalShouldHide();
    assert.isEmpty(browser.getValue('.modal-txt'));
  });

  it('Should load whatever date is already in the field', function () {
    browser.execute(() => document.querySelector('.modal-txt').value = '10/11/2012');
    showModal();
    assert.equal(browser.getText('.dp-cal-month'), 'October');
    assert.equal(browser.getText('.dp-cal-year'), '2012');
    assert.equal(browser.getText('.dp-current'), '11');
  });

  it('Should update whenever the user inputs a date', function () {
    browser.click('.txt-below');
    browser.waitUntil(() => browser.isExisting('.dp-below'));
    browser.keys('10/11/2012');
    assert.equal(browser.getText('.dp-cal-month'), 'October');
    assert.equal(browser.getText('.dp-cal-year'), '2012');
    assert.equal(browser.getText('.dp-current'), '11');
  });

  it('Should change the date when a date is clicked', function () {
    browser.execute(() => document.querySelector('.modal-txt').value = '11/12/2013');
    showModal();
    browser.execute(() => document.querySelectorAll('.dp-day')[10].click());
    modalShouldHide();
    assert.equal(browser.getValue('.modal-txt'), '11/6/2013');
  });

  it('Should show the prev month when prev arrow is clicked', function () {
    browser.execute(() => document.querySelector('.modal-txt').value = '12/7/2013');
    showModal();
    browser.click('.dp-prev');
    assert.equal(browser.getText('.dp-cal-month'), 'November');
    assert.equal(browser.getText('.dp-cal-year'), '2013');
    assert.equal(browser.getText('.dp-current'), '7');

    // Should not have changed the modal text
    assert.equal(browser.getValue('.modal-txt'), '12/7/2013');
  });

  it('Should show the next month when next arrow is clicked', function () {
    browser.execute(() => document.querySelector('.modal-txt').value = '12/8/2013');
    showModal();
    browser.click('.dp-next');
    assert.equal(browser.getText('.dp-cal-month'), 'January');
    assert.equal(browser.getText('.dp-cal-year'), '2014');
    assert.equal(browser.getText('.dp-current'), '8');

    // Should not have changed the modal text
    assert.equal(browser.getValue('.modal-txt'), '12/8/2013');
  });

  it('Allows year to be changed', function () {
    browser.execute(() => document.querySelector('.modal-txt').value = '12/8/2013');
    showModal();
    assert.equal(browser.getText('.dp-cal-year'), '2013');
    browser.click('.dp-cal-year');
    browser.execute(() => Array.prototype.slice.call(document.querySelectorAll('.dp-year'))
      .filter(el => el.textContent === '2016')
      .forEach(el => el.click()));

      assert.equal(browser.getText('.dp-cal-year'), '2016');
  });

  it('Allows month to be changed', function () {
    browser.execute(() => document.querySelector('.modal-txt').value = '12/8/2013');
    showModal();
    assert.equal(browser.getText('.dp-cal-month'), 'December');
    browser.click('.dp-cal-month');
    browser.click('[data-month="8"]'); // 0-based months

    assert.equal(browser.getText('.dp-cal-month'), 'September');
  });

  it('Shows days of the week, starting with Sunday', function () {
    showModal();
    assert.deepEqual(selectText('.dp-col-header'), ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']);

    // Verify that the first day is a Sunday
    browser.click('.dp-day');
    modalShouldHide();
    assert.equal(new Date(browser.getValue('.modal-txt')).getDay(), 0);
  });

  it('Shows days of the week, starting with Monday if weekStartsMonday', function () {
    inject('<input type="text" class="wk-mon-test" />');
    browser.execute(() => TinyDatePicker(document.querySelector('.wk-mon-test'), {weekStartsMonday: true}))
    showModalByClick('.wk-mon-test');
    assert.deepEqual(selectText('.dp-col-header'), ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);

    // Verify that the first day is a Monday
    browser.click('.dp-day');
    modalShouldHide();
    assert.equal(new Date(browser.getValue('.wk-mon-test')).getDay(), 1);
  });

  it('Handles case when monday is the 2nd of the week', function () {
    const html = `
      TinyDatePicker(document.querySelector('.wk-mon-2-test'), {
        min: new Date('1/1/1900'),
        max: new Date('1/1/2020'),
        weekStartsMonday: true
      });
    `;

    inject('<input type="text" value="1/2/1905" class="wk-mon-2-test" />');
    browser.execute((html) => new Function(html)(), html);
    showModalByClick('.wk-mon-2-test');
    assert.equal(selectFirstText('.dp-day'), '26');
  });

  it('Disallows selections outside of min/max range', function (done) {
    inject('<input type="text" class="wk-max-test" />');
    browser.execute(() => TinyDatePicker(document.querySelector('.wk-max-test'), {
      min: '1/8/2013',
      max: '1/10/2013',
      preselectedDate: '1/8/2013',
    }));
    showModalByClick('.wk-max-test');

    // The min value should be shown and selected, if today is not in the range
    assert.equal(browser.getText('.dp-cal-month'), 'January');
    assert.equal(browser.getText('.dp-cal-year'), '2013');
    assert.equal(browser.getText('.dp-current'), '8');

    // First day is outside of range and should do nothing...
    browser.click('.dp-day');
    browser.isExisting('.dp-modal');
    assert.isEmpty(browser.getValue('.wk-max-test'));
    browser.execute(() => document.querySelector('.dp-day:last-child').click());
    browser.isExisting('.dp-modal');
    assert.isEmpty(browser.getValue('.wk-max-test'));

    // Previous month should all be disabled
    browser.click('.dp-prev');
    const dpDays = browser.elements('.dp-day').value.length;
    const dpDisabled = browser.elements('.dp-day-disabled').value.length;
    assert.isAbove(dpDays, 0);
    assert.equal(dpDays, dpDisabled);
    browser.isExisting('.dp-modal');
    browser.execute(() => document.querySelectorAll('.dp-day')[9].click());
    browser.isExisting('.dp-modal');
    assert.isEmpty(browser.getValue('.wk-max-test'));
    browser.click('.dp-next');

    // Clicking a valid date should still work
    browser.execute(() => document.querySelectorAll('.dp-day')[9].click());
    modalShouldHide();
    assert.equal(browser.getValue('.wk-max-test'), '1/8/2013');
  });

  it('Allows custom formatting', function () {
    inject('<input type="text" class="wk-fmt-test" />');
    browser.execute(() => TinyDatePicker(document.querySelector('.wk-fmt-test'), {
      format(dt) {
        return 'TODAY IS ' + dt.getDay();
      }
    }));

    showModalByClick('.wk-fmt-test');
    browser.click('.dp-day');
    modalShouldHide();
    assert.match(browser.getValue('.wk-fmt-test'), /TODAY IS \d/);
  });

  it('Allows custom parsing', function () {
    inject('<input type="text" class="wk-p-test" value="not a real date" />');
    browser.execute(() => TinyDatePicker(document.querySelector('.wk-p-test'), {
      preselectedDate: 'not a real date',
      parse(dt) {
        // Verify that we only get the dates we expect
        if (dt !== 'not a real date' && dt !== '2/3/2014') {
          throw 'Got dt === ' + dt;
        }

        return new Date('2/3/2014');
      }
    }));

    showModalByClick('.wk-p-test');
    assert.equal(browser.getValue('.wk-p-test'), '2/3/2014');
    browser.click('.dp-day');
    modalShouldHide();
    assert.equal(browser.getValue('.wk-p-test'), '1/26/2014');
  });

  it('Allows custom labels', function () {
    const opts = {
      days: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
      months: ['Jul', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      today: 'Nowzers!',
      clear: '...',
      close: 'x',
    };

    inject('<input type="text" class="wk-l-test" />');
    browser.execute((opts) => TinyDatePicker(document.querySelector('.wk-l-test'), opts), opts);
    showModalByClick('.wk-l-test');
    assert.equal(browser.getText('.dp-clear'), opts.clear);
    assert.equal(browser.getText('.dp-today'), opts.today);
    assert.equal(browser.getText('.dp-close'), opts.close);
    assert.deepEqual(selectText('.dp-col-header'), opts.days);
    browser.click('.dp-cal-month');
    assert.deepEqual(selectText('.dp-month'), opts.months);
  });

  it('Triggers change event when value changes', function () {
    showModal();
    browser.execute(() => document.querySelector('.modal-txt')
      .addEventListener('change', e => window.changeWasFired = true));
    browser.click('.dp-day');
    assert.isTrue(browser.execute(() => changeWasFired).value);
  });

  it('Does not steal input focus if not modal', function () {
    browser.click('.txt-below');
    browser.waitUntil(() => browser.isExisting('.dp-below'));
    assert.isTrue(browser.hasFocus('.txt-below'));
    browser.click('.dp-today');
    assert.equal(browser.getValue('.txt-below'), new Date().toLocaleDateString());
    browser.click('.dp-clear');
    assert.isEmpty(browser.getValue('.txt-below'));
    browser.click('.dp-close');
    browser.waitUntil(() => !browser.isExisting('.dp-below'));
  });

  it('Sets focus back to the original input when shift + tab', function () {
    showModal();
    browser.keys(['Shift', 'Tab']);
    modalShouldHide();
    assert.isTrue(browser.hasFocus('.modal-txt'));
  });

  it('Sets focus back to the original input when tab', function () {
    showModal();
    browser.keys(['Tab']);
    modalShouldHide();
    assert.isTrue(browser.hasFocus('.modal-txt'));
  });

  it('Preselect with the date set in config and min max', function () {
    inject('<input type="text" class="wk-preselected-min-max-test" />');
    browser.execute(() => TinyDatePicker(document.querySelector('.wk-preselected-min-max-test'), {
      min: '1/1/1900',
      max: '1/1/2017',
      preselectedDate: '1/1/2000'
    }));
    showModalByClick('.wk-preselected-min-max-test');

    // The min value should be shown and selected, if today is not in the range
    assert.equal(browser.getText('.dp-cal-year'), '2000');
    assert.equal(browser.getText('.dp-cal-month'), 'January');
    assert.equal(browser.getText('.dp-current'), '1');
  });

  it('Preselect with the date set in config without min max', function () {
    inject('<input type="text" class="wk-preselected-test" />');
    browser.execute(() => TinyDatePicker(document.querySelector('.wk-preselected-test'), {
      preselectedDate: '1/1/2000'
    }));
    showModalByClick('.wk-preselected-test');

    // The min value should be shown and selected, if today is not in the range
    assert.equal(browser.getText('.dp-cal-year'), '2000');
    assert.equal(browser.getText('.dp-cal-month'), 'January');
    assert.equal(browser.getText('.dp-current'), '1');
  });

  it('Does not preselect if date already filled', function () {
    inject('<input type="text" class="wk-preselected-filled-test" value="2/2/1990" />');
    browser.execute(() => TinyDatePicker(document.querySelector('.wk-preselected-filled-test'), {
      preselectedDate: '1/1/2000'
    }));
    showModalByClick('.wk-preselected-filled-test');

    // The min value should be shown and selected, if today is not in the range
    assert.equal(browser.getText('.dp-cal-year'), '1990');
    assert.equal(browser.getText('.dp-cal-month'), 'February');
    assert.equal(browser.getText('.dp-current'), '2');
  });

  it('Allows customizing the css class for any given date', function () {
    inject('<input type="text" class="dt-class-test" value="2/2/1990" />');

    // Style weekends
    const html = `
      TinyDatePicker(document.querySelector('.dt-class-test'), {
        dateClass(d) {
          return (d.getDay() % 6) ? '' : 'dp-foo-test';
        }
      });
    `;

    browser.execute((html) => new Function(html)(), html);

    showModalByClick('.dt-class-test');

    const foos = browser.elements('.dp-foo-test').value.length;
    const fooVals = browser.getAttribute('.dp-foo-test', 'data-date');

    assert.equal(foos, 12); // We always show 6 weeks, so this means 6 saturdays and 6 sundays

    assert.isTrue(fooVals.every(d => {
      const dt = new Date(parseInt(d));
      return dt.getDay() == 0 || dt.getDay() == 6;
    }));
  });

  it('Allows customizing the disabled range', function () {
    inject('<input type="text" class="dt-range-test" />');

    // Disable weekends
    const html = `
      TinyDatePicker(document.querySelector('.dt-range-test'), {
        inRange(d) {
          return (d.getDay() % 6);
        }
      });
    `;

    browser.execute((html) => new Function(html)(), html);

    showModalByClick('.dt-range-test');

    const dpDisabled = browser.elements('.dp-day-disabled').value.length;
    const disabledVals = browser.getAttribute('.dp-day-disabled', 'data-date');

    assert.equal(dpDisabled, 12); // We always show 6 weeks, so this means 6 saturdays and 6 sundays

    assert.isTrue(disabledVals.every(d => {
      const dt = new Date(parseInt(d));
      return dt.getDay() == 0 || dt.getDay() == 6;
    }));
  });

  // Helpers
  function inject(html) {
    browser.execute((html) => document.body.innerHTML += html, html);
  }

  function selectText(selector) {
    return browser.execute((selector) => {
      return Array.prototype.slice.call(document.querySelectorAll(selector))
        .map(el => el.textContent)
    }, selector).value;
  }

  function selectFirstText(selector) {
    return browser.execute(
      (selector) => document.querySelector(selector).textContent,
      selector
    ).value;
  }

  function showModalByClick(selector) {
    browser.element(selector).click();
    browser.waitUntil(() => browser.isExisting('.dp-modal'));
  }

  function showModal(selector) {
    assert.isFalse(browser.isExisting('.dp-modal'));
    setFocus(selector || '.modal-txt');
    assert.ok(browser.element('.dp-modal'));
  }

  function modalShouldHide() {
    browser.waitUntil(() => !browser.isExisting('.dp-modal'));
  }

  function setFocus(selector) {
    browser.execute('document.querySelector("' + selector + '").focus()');
  }
});
