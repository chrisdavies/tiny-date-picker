/**
 * @file Defines the permanent date picker behavior.
 */
import {noop} from '../lib/fns';
import BaseMode from './base-mode';

export default function PermanentMode(root, opts) {
  var dp = BaseMode(root, opts);

  dp.close = noop;
  dp.destroy = noop;
  dp.updateInput = noop;

  dp.computeSelectedDate = function () {
    return opts.preselectedDate;
  };

  dp.attachToDom = function () {
    root.appendChild(dp.el);
  };

  dp.open();

  return dp;
}
