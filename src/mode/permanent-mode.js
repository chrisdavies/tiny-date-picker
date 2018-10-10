/**
 * @file Defines the permanent date picker behavior.
 */
import {noop} from '../lib/fns';
import BaseMode from './base-mode';

export default function PermanentMode(root, emit, opts) {
  var dp = BaseMode(root, emit, opts);

  dp.close = noop;
  dp.updateInput = noop;
  dp.shouldFocusOnRender = opts.shouldFocusOnRender;

  dp.computeSelectedDate = function () {
    return opts.hilightedDate;
  };

  dp.attachToDom = function () {
    root.appendChild(dp.el);
  };

  dp.open();

  return dp;
}
