'use strict';
/* global browser */

describe('TinyDatePicker', function() {
  beforeEach(() => browser.url('/'));

  it('Should show the modal when the modal input gains focus', function () {
    showModal();
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
    browser.getValue('.modal-txt').should.eql('');
  });

  it('Should select today when today is clicked', function () {
    showModal();
    browser.click('.dp-today');
    modalShouldHide();
    browser.hasFocus('.modal-txt').should.be.true;
    browser.getValue('.modal-txt').should.eql(new Date().toLocaleDateString());
  });

  it('Should clear the date field when clear is clicked', function () {
    browser.execute(() => document.querySelector('.modal-txt').value = '10/20/2016');
    showModal();
    browser.click('.dp-clear');
    modalShouldHide();
    browser.getValue('.modal-txt').should.eql('');
  });

  it('Should load whatever date is already in the field', function () {
    browser.execute(() => document.querySelector('.modal-txt').value = '10/11/2012');
    showModal();
    browser.getText('.dp-cal-month').should.eql('October');
    browser.getText('.dp-cal-year').should.eql('2012');
    browser.getText('.dp-current').should.eql('11');
  });

  it('Should update whenever the user inputs a date', function () {
    browser.click('.txt-below');
    browser.waitUntil(() => browser.isExisting('.dp-below'));
    browser.keys('10/11/2012');
    browser.getText('.dp-cal-month').should.eql('October');
    browser.getText('.dp-cal-year').should.eql('2012');
    browser.getText('.dp-current').should.eql('11');
  });

  it('Should change the date when a date is clicked', function () {
    browser.execute(() => document.querySelector('.modal-txt').value = '11/12/2013');
    showModal();
    browser.execute(() => document.querySelectorAll('.dp-day')[10].click());
    modalShouldHide();
    browser.getValue('.modal-txt').should.eql('11/6/2013');
  });

  it('Should show the prev month when prev arrow is clicked', function () {
    browser.execute(() => document.querySelector('.modal-txt').value = '12/7/2013');
    showModal();
    browser.click('.dp-prev');
    browser.getText('.dp-cal-month').should.eql('November');
    browser.getText('.dp-cal-year').should.eql('2013');
    browser.getText('.dp-current').should.eql('7');

    // Should not have changed the modal text
    browser.getValue('.modal-txt').should.eql('12/7/2013');
  });

  it('Should show the next month when next arrow is clicked', function () {
    browser.execute(() => document.querySelector('.modal-txt').value = '12/8/2013');
    showModal();
    browser.click('.dp-next');
    browser.getText('.dp-cal-month').should.eql('January');
    browser.getText('.dp-cal-year').should.eql('2014');
    browser.getText('.dp-current').should.eql('8');

    // Should not have changed the modal text
    browser.getValue('.modal-txt').should.eql('12/8/2013');
  });

  it('Allows year to be changed', function () {
    browser.execute(() => document.querySelector('.modal-txt').value = '12/8/2013');
    showModal();
    browser.getText('.dp-cal-year').should.eql('2013');
    browser.click('.dp-cal-year');
    browser.execute(() => Array.prototype.slice.call(document.querySelectorAll('.dp-year'))
      .filter(el => el.textContent === '2016')
      .forEach(el => el.click()));

    browser.getText('.dp-cal-year').should.eql('2016');
  });

  it('Allows month to be changed', function () {
    browser.execute(() => document.querySelector('.modal-txt').value = '12/8/2013');
    showModal();
    browser.getText('.dp-cal-month').should.eql('December');
    browser.click('.dp-cal-month');
    browser.click('[data-month="8"]'); // 0-based months

    browser.getText('.dp-cal-month').should.eql('September');
  });

  it('Shows days of the week, starting with Sunday', function () {
    showModal();
    selectText('.dp-col-header').should.eql(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']);

    // Verify that the first day is a Sunday
    browser.click('.dp-day');
    modalShouldHide();
    new Date(browser.getValue('.modal-txt')).getDay().should.eql(0);
  });

  it('Shows days of the week, starting with Monday if weekStartsMonday', function () {
    inject('<input type="text" class="wk-mon-test" />');
    browser.execute(() => TinyDatePicker(document.querySelector('.wk-mon-test'), {weekStartsMonday: true}))
    showModalByClick('.wk-mon-test');
    selectText('.dp-col-header').should.eql(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);

    // Verify that the first day is a Monday
    browser.click('.dp-day');
    modalShouldHide();
    new Date(browser.getValue('.wk-mon-test')).getDay().should.eql(1);
  });

  it('Disallows selections outside of min/max range', function () {
    inject('<input type="text" class="wk-max-test" />');
    browser.execute(() => TinyDatePicker(document.querySelector('.wk-max-test'), {
      min: '1/2/2013',
      max: '1/5/2013'
    }));
    showModalByClick('.wk-max-test');

    // The min value should be shown and selected, if today is not in the range
    browser.getText('.dp-cal-month').should.eql('January');
    browser.getText('.dp-cal-year').should.eql('2013');
    browser.getText('.dp-current').should.eql('2');

    // First day is outside of range and should do nothing...
    browser.click('.dp-day');
    browser.isExisting('.dp-modal');
    browser.getValue('.wk-max-test').should.eql('');
    browser.execute(() => document.querySelector('.dp-day:last-child').click());
    browser.isExisting('.dp-modal');
    browser.getValue('.wk-max-test').should.eql('');

    // Clicking a valid date should still work
    browser.execute(() => document.querySelectorAll('.dp-day')[5].click());
    modalShouldHide();
    browser.getValue('.wk-max-test').should.eql('1/4/2013');
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
    browser.getValue('.wk-fmt-test').should.match(/TODAY IS \d/);
  });

  it('Allows custom parsing', function () {
    inject('<input type="text" class="wk-p-test" value="not a real date" />');
    browser.execute(() => TinyDatePicker(document.querySelector('.wk-p-test'), {
      parse(dt) {
        // Verify that we only get the dates we expect
        if (dt !== 'not a real date' && dt !== '2/3/2014') {
          throw 'Got dt === ' + dt;
        }

        return new Date('2/3/2014');
      }
    }));

    showModalByClick('.wk-p-test');
    browser.getValue('.wk-p-test').should.eql('2/3/2014');
    browser.click('.dp-day');
    modalShouldHide();
    browser.getValue('.wk-p-test').should.eql('1/26/2014');
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
    browser.getText('.dp-clear').should.eql(opts.clear);
    browser.getText('.dp-today').should.eql(opts.today);
    browser.getText('.dp-close').should.eql(opts.close);
    selectText('.dp-col-header').should.eql(opts.days);
    browser.click('.dp-cal-month');
    selectText('.dp-month').should.eql(opts.months);
  });

  it('Triggers change event when value changes', function () {
    showModal();
    browser.execute(() => document.querySelector('.modal-txt')
      .addEventListener('change', e => window.changeWasFired = true));
    browser.click('.dp-day');
    browser.execute(() => changeWasFired).value.should.eql(true);
  });

  it('Does not steal input focus if not modal', function () {
    browser.click('.txt-below');
    browser.waitUntil(() => browser.isExisting('.dp-below'));
    browser.hasFocus('.txt-below').should.be.true;
    browser.click('.dp-today');
    browser.getValue('.txt-below').should.eql(new Date().toLocaleDateString());
    browser.click('.dp-clear');
    browser.getValue('.txt-below').should.eql('');
    browser.click('.dp-close');
    browser.waitUntil(() => !browser.isExisting('.dp-below'));
  });

  it('Sets focus back to the original input when shift + tab', function () {
    showModal();
    browser.keys(['Shift', 'Tab']);
    modalShouldHide();
    browser.hasFocus('.modal-txt').should.be.true;
  });

  it('Sets focus back to the original input when tab', function () {
    showModal();
    browser.keys(['Tab']);
    modalShouldHide();
    browser.hasFocus('.modal-txt').should.be.true;
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

  function showModalByClick(selector) {
    browser.element(selector).click();
    browser.waitUntil(() => browser.isExisting('.dp-modal'));
  }

  function showModal(selector) {
    browser.isExisting('.dp-modal').should.be.false;
    setFocus(selector || '.modal-txt');
    browser.element('.dp-modal').should.be.defined;
  }

  function modalShouldHide() {
    browser.waitUntil(() => !browser.isExisting('.dp-modal'));
  }

  function setFocus(selector) {
    browser.execute('document.querySelector("' + selector + '").focus()');
  }
});
