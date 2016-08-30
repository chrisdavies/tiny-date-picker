/*
  TODO: Test opts overriding
*/

jest.dontMock('../tiny-date-picker');

var Keys = {
  left: 37,
  up: 38,
  right: 39,
  down: 40,
  enter: 13,
  esc: 27,
};

describe('TinyDatePicker', function () {
  it('Puts todays date into the input field when clicking Today', function () {
    var dp = getDatePicker();
    var input = $('input');

    input.click();
    $('.dp-today').click();
    expect(input.value).toBe(nowString());
    calendarShouldBeHidden();
  });

  it('Clears the input value when clicking Clear', function () {
    var dp = getDatePicker();
    var input = $('input');

    input.value = nowString();
    input.click();
    $('.dp-clear').click();
    expect(input.value).toBe('');
    calendarShouldBeHidden();
  });

  it('Clears the input value when clicking Clear and max is past', function () {
    var dp = getDatePicker({max: '9/23/2015'});
    var input = $('input');

    input.value = nowString();
    input.click();
    $('.dp-clear').click();
    expect(input.value).toBe('');
    calendarShouldBeHidden();
  });

  it('Closes the calendar when clicking Close', function () {
    var dp = getDatePicker();
    var input = $('input');
    var originalValue = '1/2/2016';

    input.value = originalValue;
    input.click();
    $('.dp-close').click();
    expect(input.value).toBe(originalValue);
    calendarShouldBeHidden();
  });

  it('Closes the calendar when pressing Esc', function () {
    testKeyNavigation('', [Keys.esc], '');
    calendarShouldBeHidden();
  });

  it('Selects the date specified in the input', function () {
    var dp = getDatePicker();
    var input = $('input');
    var originalValue = '1/2/2014';

    input.value = originalValue;
    setFocus(input);

    expectCalendar('2014', 'January', '2');
  });

  it('Selects the clicked date', function () {
    var dp = getDatePicker();
    var input = $('input');
    var originalValue = '9/26/2015';

    input.value = originalValue;
    setFocus(input);

    document.querySelectorAll('.dp-day')[8].click();
    expect(input.value).toBe('9/7/2015');
    calendarShouldBeHidden();
  });

  it('Starts the week on Sunday by default', function () {
    var dp = getDatePickerWithInitalDate({}, '9/26/2015');
    var input = $('input');

    setFocus(input);
    expect($('.dp-day-of-week').textContent).toBe("Sun");

    $('.dp-day').click();
    expect(input.value).toBe('8/30/2015');
  });

  it('Starts the week on Monday if weekStartsMonday is set', function () {
    var dp = getDatePickerWithInitalDate({weekStartsMonday: true}, '9/26/2015');
    var input = $('input');

    setFocus(input);
    expect($('.dp-day-of-week').textContent).toBe("Mon");

    $('.dp-day').click();
    expect(input.value).toBe('8/31/2015');
  });

  it('Does not select date lower than min specified', function () {
    var dp = getDatePicker({min: '9/23/2015'});
    var input = $('input');
    var originalValue = '9/26/2015';

    input.value = originalValue;
    setFocus(input);

    document.querySelectorAll('.dp-day')[8].click();
    expect(input.value).toBe('9/26/2015');
  });

  it('Does not select date higher than max specified', function () {
    var dp = getDatePicker({max: '9/23/2015'});
    var input = $('input');
    var originalValue = '9/22/2015';

    input.value = originalValue;
    setFocus(input);

    document.querySelectorAll('.dp-day')[25].click();
    expect(input.value).toBe('9/22/2015');
  });

  it('Selects min date when initial date is lower than min specified', function () {
    var dp = getDatePickerWithInitalDate({min: '9/23/2015'}, '9/20/2015');
    var input = $('input');
    setFocus(input);

    expectCalendar('2015', 'September', '23');
  });

  it('Selects max date when initial date is higher than max specified', function () {
    var dp = getDatePickerWithInitalDate({max: '9/25/2015'}, '9/29/2015');
    var input = $('input');
    setFocus(input);

    expectCalendar('2015', 'September', '25');
  });

  it('Shows the previous month when clicking prev', function () {
    testMonthNavigation('9/26/2015', '.dp-prev', '2015', 'August', '26');
  });

  it('Shows the next month when clicking next', function () {
    testMonthNavigation('9/26/2015', '.dp-next', '2015', 'October', '26');
  });

  it('Next handles moving from 31st of one month to 30th of another', function () {
    testMonthNavigation('10/31/2015', '.dp-next', '2015', 'November', '30');
  });

  it('Prev handles moving from 31st of one month to 30th of another', function () {
    testMonthNavigation('12/31/2015', '.dp-prev', '2015', 'November', '30');
  });

  it('Navigates back a week when up is pressed', function () {
    testKeyNavigation('9/26/2015', [Keys.up, Keys.enter], '9/19/2015');
    calendarShouldBeHidden();
  });

  it('Navigates forward a week when down is pressed', function () {
    testKeyNavigation('9/26/2015', [Keys.down, Keys.enter], '10/3/2015');
    calendarShouldBeHidden();
  });

  it('Navigates back a day when left is pressed', function () {
    testKeyNavigation('9/26/2015', [Keys.left, Keys.enter], '9/25/2015');
    calendarShouldBeHidden();
  });

  it('Navigates forward a day when right is pressed', function () {
    testKeyNavigation('9/26/2015', [Keys.right, Keys.enter], '9/27/2015');
    calendarShouldBeHidden();
  });

  it('Puts focus on the input when hidden', function () {
    var dp = getDatePicker();
    var input = $('input');
    var originalValue = '1/2/2016';

    input.value = originalValue;
    input.click();

    expect(document.activeElement).not.toBe(input);

    $('.dp-close').click();

    expect(document.activeElement).toBe(input);
    calendarShouldBeHidden();
  });
});

function testKeyNavigation(startDate, keys, endDate) {
  var dp = getDatePicker();
  var input = $('input');
  var originalValue = startDate;

  input.value = originalValue;
  setFocus(input);

  keys.forEach(function (key) {
    keydown($('.dp-selected'), key);
  });

  expect(input.value).toBe(endDate);
}

function testMonthNavigation(date, button, year, month, day) {
  var dp = getDatePicker();
  var input = $('input');
  var originalValue = date;

  input.value = originalValue;
  setFocus(input);

  $(button).click();
  expectCalendar(year, month, day);
}

function keydown(el, key) {
  var event = new Event('keydown');
  event.which = key;
  event.target = el;
  el.dispatchEvent(event);
}

function setFocus(el) {
  var event = new Event('focus');

  el.focus();

  // Dispatch the focus event, as Jest doesn't properly simulate this
  el.dispatchEvent(event);
}

function $(selector) {
  return document.querySelector(selector);
}

function expectCalendar(year, month, date) {
  expect($('.dp-selected').textContent.trim()).toBe(date);
  expect($('.dp-month').textContent.trim()).toBe(month);
  expect($('.dp-year').textContent.trim()).toBe(year);
}

function calendarShouldBeHidden() {
  expect(!document.querySelector('.dp')).toBe(true);
}

function nowString() {
  var now = new Date();
  return (now.getMonth() + 1) + '/' + now.getDate() + '/' + now.getFullYear();
}

function getDatePicker(opts) {
  document.body.innerHTML = '<button>A</button><input type="text"><button>B</button>';

  var fn = require('../tiny-date-picker');
  return new fn(document.querySelector('input'), opts);
}

function getDatePickerWithInitalDate(opts, initialDate) {
  document.body.innerHTML = '<button>A</button><input type="text" value="' + initialDate + '"><button>B</button>';

  var fn = require('../tiny-date-picker');
  return new fn(document.querySelector('input'), opts);
}
