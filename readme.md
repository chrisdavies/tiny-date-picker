# Tiny Date Picker

A light-weight date picker with zero dependencies.

- Zero dependencies
- Roughly 3.5KB minified and gzipped
- IE9+
- Mobile-friendly/responsive
- Supports multiple languages
- [TinyDatePicker demo](https://chrisdavies.github.io/tiny-date-picker/)

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

## Documentation

- [TinyDatePicker documentation](./docs/tiny-date-picker.md)
- [DateRangePicker documentation](./docs/date-range-picker.md)

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
