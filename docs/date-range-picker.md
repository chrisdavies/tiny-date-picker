# Date Range Picker

A date picker that supports ranges. This is an alpha release. The API will get
extended with time, and possibly break.

- Zero dependencies
- Roughly 4KB minified and gzipped
- IE9+
- Mobile-friendly/responsive
- Supports multiple languages

[See the demo...](http://chrisdavies.github.io/tiny-date-picker)

## Installation

    npm install --save tiny-date-picker

## Usage

Include a reference to `tiny-date-picker.css` and `date-range-picker.js`, or import
it `import {DateRangePicker} from 'tiny-date-picker/dist/date-range-picker';` then call it like this:

```javascript
// Initialize a date range picker within the specified container
DateRangePicker(document.querySelector('.container'));

// Or with a CSS selector
DateRangePicker('.container');
```

Any options that you would have passed to TinyDatePicker can be passed to the DateRangePicker, but with a twist:

```javascript
DateRangePicker('.cls', {
  startOpts: {}, // The options passed to the start date picker
  endOpts: {}, // The options passed to the end date picker
});
```

See [TinyDatePicker's docs](./tiny-date-picker.md) for more details.


## DateRangePicker object

The DateRangePicker context is returned from the `DateRangePicker` function, and can be used to manipulate the date picker as documented below:

```javascript
// Initialize a date picker in the specified container
const dp = DateRangePicker('.container');

// Get the start date (can be null)
dp.state.start;

// Get the end date (can be null)
dp.state.end;

// Add an event handler
dp.on('statechange', (_, picker) => console.log(picker.state));

// Remove all event handlers (see the Events section for more information)
dp.off();

// Update the date picker's state and redraw as necessary.
// This example causes the date picker to select the specified start date
// and end date.
dp.setState({
  start: new Date('10/12/2017'),
  start: new Date('10/14/2017'),
});

```

## Events

The DateRangePicker object has an `on` and `off` method which allows you to register and unregister various event handlers.

- statechange: Fired when the date picker's state changes (start or end date is selected).

The event handler is passed two arguments: the name of the event, and the date picker object.

```js
// Log the selected date range any time it changes
DateRangePicker('.container')
  .on('statechange', (_, dp) => console.log(`${dp.state.start}-${dp.state.end}));
```

To remove an event handler, you call the date picker's `off` method, as with TinyDatePicker.

## Style

All CSS class names for TinyDatePicker begin with `dp-`, and all CSS class names for DateRangePicker begin with `dr-`.


## Using TinyDatePicker and DateRangePicker together

If you are using both TinyDatePicker and DateRangePicker, the only thing you should
include in your project is DateRangePicker, as it includes TinyDatePicker. This was done
to keep the overall bundle size down.

```javascript
// Do this
import {TinyDatePicker, DateRangePicker} from 'tiny-date-picker/date-range-picker';

// Don't do this, as this will double-include tiny-date-picker.
import TinyDatePicker from 'tiny-date-picker';
import {DateRangePicker} from 'tiny-date-picker/date-range-picker';
```

## Positioning, showing, hiding, etc.

DateRangePicker is intentionally minimal. It does not show/hide or attach to inputs
directly. This is left up to the consumer. [See the demo](http://chrisdavies.github.io/tiny-date-picker/range-picker) for an example of how
this might be done.
