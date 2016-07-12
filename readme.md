# Tiny Date Picker

A light-weight date picker with zero dependencies.

- Zero dependencies
- Roughly 1.7KB minified and gzipped
- IE9+
- Mobile-friendly/responsive
- Based loosely on the awesome [pickadate](http://amsul.ca/pickadate.js/), but without jQuery

[See the demo...](http://chrisdavies.github.io/tiny-date-picker/)

[![Build Status](https://travis-ci.org/chrisdavies/tiny-date-picker.svg?branch=master)](https://travis-ci.org/chrisdavies/tiny-date-picker)

## Usage

Include a reference to `tiny-date-picker.css` and `tiny-date-picker.js`, then call it like this:

```javascript
// Initialize a date picker on the specified input element
TinyDatePicker(document.querySelector('input'));
```

You can also pass in options as an optional second argument:

```javascript
// Initialize a date picker using truncated month names
TinyDatePicker(document.querySelector('input'), {
  months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
});
```

The input to which the date picker is attached will fire its `change` event
any time the date value chanegs.

## Options

Below is an example of all option parameters:

```javascript

TinyDatePicker(document.querySelector('input'), {
  // Used to convert a date into a string to be used as the value of input
  format: function (date) {
    return date.toLocaleDateString();
  },

  // Used to parse a date string and return a date (e.g. parsing the input value)
  parse: function (str) {
    var date = new Date(str);
    return isNaN(date) ? new Date() : date;
  },

  // Names of months, in order
  months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],

  // Names of days of week, in order
  days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],

  // The text for the button used to set the date to today's date
  today: 'Today',

  // The text for the button used to clear the input value
  clear: 'Clear',

  // The text for the button used to close the form
  close: 'Close'
});
```

## Style

All CSS class names begin with `dp-`, and every element in the calendar has a class. The style rules
in `tiny-date-picker.css` have been kept as unspecific as possible so they can be easily overruled.

For more info, launch a date picker and use the browser dev tools to inspect its structure and shape.

## Aria

There is currently no Aria support baked into Tiny Date Picker, but it is planned.

## Browserify

This library is [CommonJS](http://www.commonjs.org/) compatible, so you can use it in this way:

```javascript
var TinyDatePicker = require('tiny-date-picker'),

TinyDatePicker(document.querySelector('input'));
```

## Installation

Just download `tiny-date-picker.min.js` and `tiny-date-picker.css`, or use bower:

    bower install tiny-date-picker

Or use npm:
https://www.npmjs.com/package/tiny-date-picker

    npm install --save tiny-date-picker

## Contributing

Make your changes (and add tests), then run the tests:

    npm test

If all is well, build your changes:

    npm run min

## License MIT

Copyright (c) 2015 Chris Davies

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
