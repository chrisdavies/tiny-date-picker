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