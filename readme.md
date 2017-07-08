# Tiny Date Picker

A light-weight date picker with zero dependencies.

- Zero dependencies
- Roughly 2.5KB minified and gzipped
- IE9+
- Mobile-friendly/responsive

[See the demo...](http://chrisdavies.github.io/tiny-date-picker/)


## Installation

    npm install --save tiny-date-picker


## Usage

Include a reference to `tiny-date-picker.css` and `tiny-date-picker.js`, then call it like this:

```javascript
// Initialize a date picker on the specified input element
TinyDatePicker(document.querySelector('input'));

// Or with a selector
TinyDatePicker('.some-class-or-id-or-whatever');
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

The DatePicker context is returned by the `TinyDatePicker`. See below for further details.

```javascript
// Initialize a date picker on the specified input element
const dp = TinyDatePicker(document.querySelector('input'));

// Show the date picker
dp.open();
```


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
  close: 'Close',

  // Specifies the minimum date that can be selected
  min: '10/1/2016',

  // Specifies the maximum date that can be selected
  max: '10/22/2016',

  // Place datepicker selector on this date if field is still empty
  preselectedDate: '10/20/2016',

  // There are three modes: dp-modal (the default), dp-permanent and dp-below.
  // dp-modal makes the date picker show up as a modal.
  // dp-below makes it show up beneath its input element.
  // dp-permanent displays the calendar permanently with no input needed
  mode: 'dp-below',

  // Whether to use Monday as start of the week
  weekStartsMonday: false,

  // A function which is called any time the date picker opens
  onOpen: function (context) {
    // context is the datepicker context, detailed below
  },

  // A function which is called any time the year is selected
  // in the year menu
  onSelectYear: function (context) {
    // context is the datepicker context, detailed below
  },

  // A function which is called any time the month is selected
  // in the month menu
  onSelectMonth: function (context) {
    // context is the datepicker context, detailed below
  },

  // A function which is called when the date changes, before the modal closes
  // and before the input's value is updated.
  onChangeDate: function (context) {
    // context is the datepicker context, detailed below
  },
  
  // A function which is called any time the date in the calendar is changed  
  // either vía UI buttons or the API
  onSelect: function(context){
    // context is the datepicker context, detailed below    
  }
});
```

## Context

The `onOpen`, `onSelectYear`, and `onSelectMonth` event handlers receive the date picker context object. This has many properties and methods, the most useful of which are as follows:

### Properties

- currentDate: the currently selected date (a Date object)
- input: the input element to which the date picker is bound

### Methods

- open(): opens the modal
- close(): closes the modal
- openYears(): shows the modal with the years menu showing
- openMonths(): shows the modal with the months menu showing
- setValue(date): sets the date as a string value
- goMonth(offset): Browse the calendar interface adding the number of months passed by parametter
- goYear(offset): Browse the calendar interface adding the number of years passed by parametter 
- direct(date): Browse the calendar interface to a specific date passed by parametter. 

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

TinyDatePicker(document.querySelector('input'));
```

Or, with ES6:

```javascript
import TinyDatePicker from 'tiny-date-picker',

TinyDatePicker(document.querySelector('input'));
```


## Contributing

First, you'll need to have selenium installed and running, as detailed [here](http://webdriver.io/guide/getstarted/install.html) and you'll need to serve the test HTML page by running `npm start`.

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
