/**
 * @file Defines simple event emitter behavior.
 */

/**
 * Emitter constructs a new emitter object which has on/off methods.
 *
 * @returns {EventEmitter}
 */
export default function Emitter() {
  var handlers = {};

  function onOne(name, handler) {
    (handlers[name] = (handlers[name] || [])).push(handler);
  }

  function onMany(fns) {
    for (var name in fns) {
      onOne(name, fns[name]);
    }
  }

  return {
    on: function (name, handler) {
      if (handler) {
        onOne(name, handler);
      } else {
        onMany(name);
      }

      return this;
    },

    emit: function (name, arg) {
      (handlers[name] || []).forEach(function (handler) {
        handler(name, arg);
      });
    },

    off: function (name, handler) {
      if (!name) {
        handlers = {};
      } else if (!handler) {
        handlers[name] = [];
      } else {
        handlers[name] = (handlers[name] || []).filter(function (h) {
          return h !== handler;
        });
      }

      return this;
    }
  };
}
