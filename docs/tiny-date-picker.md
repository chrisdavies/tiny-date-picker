# Tiny Date Picker

A light-weight date picker with zero dependencies.

- Zero dependencies
- Roughly 3.5KB minified and gzipped
- IE9+
- Mobile-friendly/responsive
- Supports multiple languages

[See the demo...](http://chrisdavies.github.io/tiny-date-picker/)


## Installation

    npm install --save tiny-date-picker

## Usage

Include a reference to `tiny-date-picker.css` and `tiny-date-picker.js`, or import
it `import TinyDatePicker from 'tiny-date-picker';` then call it like this:

```javascript
// Initialize a date picker on the specified input element
TinyDatePicker(document.querySelector('input'));

// Or with a CSS selector
TinyDatePicker('.some-class-or-id-or-whatever');
```

You can also pass in options as an optional second argument:

```javascript
// Initialize a date picker using truncated month names
TinyDatePicker(document.querySelector('input'), {
  lang: {
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  },
});
```

## DatePicker object

The DatePicker context is returned from the `TinyDatePicker` function, and can be used to
manipulate the date picker as documented below:

```javascript
// Initialize a date picker on the specified input element
const dp = TinyDatePicker('input');

// Show the date picker
dp.open();

// Hide the date picker (does nothing if the date picker is in permanent mode)
dp.close();

// Get the current view of the date picker. Possible values are:
// - 'day': The calendar is showing the day picker (the default)
// - 'month': The calendar is showing the month picker
// - 'year': The calendar is showing the year picker
dp.state.view;

// Get the currently selected date (can be null)
dp.state.selectedDate;

// Get the currently hilighted date (should not be null)
dp.state.hilightedDate;

// Add an event handler
dp.on('statechange', (_, picker) => console.log(picker.state));

// Remove all event handlers (see the Events section for more information)
dp.off();

// Update the date picker's state and redraw as necessary.
// This example causes the date picker to show the month-picker view.
// You can use setStsate to change the selectedDate or hilightedDate as well.
dp.setState({
  view: 'month',
});

// Close the date picker and remove all event handlers from the input
dp.destroy()

```

## Options

TinyDatePicker can be configured by passing it a second argument:

```javascript

TinyDatePicker('input', {
  // What dom element the date picker will be added to. This defaults
  // to document.body
  appendTo: document.querySelector('.foo'),

  // Lang can be used to customize the text that is displayed
  // in the calendar. You can use this to display a different language.
  lang: {
    days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    months: [
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
    ],
    today: 'Today',
    clear: 'Clear',
    close: 'Close',
  },

  // format {Date} -> string is a function which takes a date and returns a string. It can be used to customize
  // the way a date will look in the input after the user has selected it, and is particularly
  // useful if you're targeting a non-US customer.
  format(date) {
    return date.toLocaleDateString();
  },

  // parse {string|Date} -> Date is the inverse of format. If you specify one, you probably should specify the other
  // the default parse function handles whatever the new Date constructor handles. Note that
  // parse may be passed either a string or a date.
  parse(str) {
    var date = new Date(str);
    return isNaN(date) ? new Date() : date;
  },

  // mode {'dp-modal'|'dp-below'|'dp-permanent'} specifies the way the date picker should display:
  // 'dp-modal' displays the picker as a modal
  // 'dp-below' displays the date picker as a dropdown
  // 'dp-permanent' displays the date picker as a permanent (always showing) calendar
  mode: 'dp-modal',

  // hilightedDate specifies what date to hilight when the date picker is displayed and the
  // associated input has no value.
  hilightedDate: new Date(),

  // min {string|Date} specifies the minimum date that can be selected (inclusive).
  // All earlier dates will be disabled.
  min: '10/1/2016',

  // max {string|Date} specifies the maximum date that can be selected (inclusive).
  // All later dates will be disabled.
  max: '10/1/2020',

  // inRange {Date} -> boolean takes a date and returns true or false. If false, the date
  // will be disabled in the date picker.
  inRange(dt) {
    return dt.getFullYear() % 2 > 0;
  },

  // dateClass {Date} -> string takes a date and returns a CSS class name to be associated
  // with that date in the date picker.
  dateClass(dt) {
    return dt.getFullYear() % 2 ? 'odd-date' : 'even-date';
  },

  // dayOffset {number} specifies which day of the week is considered the first. By default,
  // this is 0 (Sunday). Set it to 1 for Monday, 2 for Tuesday, etc.
  dayOffset: 1
})

```

## Events

The input to which the date picker is attached will fire its `change` event
any time the date value changes.

The DatePicker object has an `on` and `off` method which allows you to register and unregister various event handlers.

- open: Fired when the date picker opens / is shown
- close: Fired when the date picker closes / is hidden
- statechange: Fired when the date picker's state changes (view changes, hilighted date changes, selected date changes)
- select: Fired when hte date picker's selected date changes (e.g. when the user picks a date)

The event handler is passed two arguments: the name of the event, and the date picker object.

```js
// Log the selected date any time it changes
TinyDatePicker('.my-input')
  .on('select', (_, dp) => console.log(dp.state.selectedDate))
  .on('close', () => console.log('CLOSED!!!'));

// You can also register for multiple events at once without chaining the on method:
TinyDatePicker('.my-input')
  .on({
    select: (_, dp) => console.log(dp.state.selectedDate),
    close: () => console.log('CLOSED!!!')
  });
```

To remove an event handler, you call the date picker's `off` method.

```js
const dp = TinyDatePicker('.example');

function onOpen() {
  console.log('OPENED!!!');
}

dp.on('open', onOpen);

// Remove this specific open event handler
dp.off('open', onOpen);

// Remove all handlers of the open event
dp.off('open');

// Remove all handlers of any event
dp.off();

```

## Style

All CSS class names begin with `dp-`, and every element in the calendar has a class. The style rules
in `tiny-date-picker.css` have been kept as unspecific as possible so they can be easily overruled.

For more info, launch a date picker and use the browser dev tools to inspect its structure and shape.

## Aria

There is currently no Aria support baked into Tiny Date Picker, but it is planned.

## Bundling

This library is [CommonJS](http://www.commonjs.org/) compatible, so you can use it in this way:

```javascript
var TinyDatePicker = require('tiny-date-picker'),

TinyDatePicker('.my-input');
```

Or, with ES6:

```javascript
import TinyDatePicker from 'tiny-date-picker',

TinyDatePicker('.my-input');
```

## DateRanges

If you want to pick date ranges, see [DateRangePicker](./date-range-picker.md).

## Version 2.x

If you're using version 2.x, the docs are [here](https://github.com/chrisdavies/tiny-date-picker/tree/dev/v2).

Migration to 3.x is documented [here](https://github.com/chrisdavies/tiny-date-picker/wiki/Changes-from-2.0-to-3.0).

## Contributing

TinyDatePicker supports IE9+, and does so without need for a transpiler (Babel or TypeScript). So when
contributing, be sure to write plain old vanilla ES3.

Make sure all tests are passing:

- Put the [Chrome webdriver](https://sites.google.com/a/chromium.org/chromedriver/downloads) somewhere in your path.
- Run `npm start`
- In a new terminal tab/window, run `npm test`

If all is well, build your changes:

    npm run min
