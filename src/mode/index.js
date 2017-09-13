/**
 * @file Defines the various date picker modes (modal, dropdown, permanent)
 */

import ModalMode from './modal-mode';
import DropdownMode from './dropdown-mode';
import PermanentMode from './permanent-mode';

export default function Mode(input, emit, opts) {
  input = input && input.tagName ? input : document.querySelector(input);

  if (opts.mode === 'dp-modal') {
    return ModalMode(input, emit, opts);
  }

  if (opts.mode === 'dp-below') {
    return DropdownMode(input, emit, opts);
  }

  if (opts.mode === 'dp-permanent') {
    return PermanentMode(input, emit, opts);
  }
}
