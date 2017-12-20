(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g=(g.fav||(g.fav = {}));g=(g.prop||(g.prop = {}));g.omitDeep = f()}})(function(){var define,module,exports;return (function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
'use strict';

var assignDeep = require('@fav/prop.assign-deep');
var getDeep = require('@fav/prop.get-deep');
var isArray = require('@fav/type.is-array');

function omitDeep(src, omittedPropPaths) {
  var dest = assignDeep({}, src);

  if (omittedPropPaths == null) {
    return dest;
  }

  if (!isArray(omittedPropPaths)) {
    return dest;
  }

  for (var i = 0, n = omittedPropPaths.length; i < n; i++) {
    omitDeepEach(dest, omittedPropPaths[i]);
  }
  return dest;
}

function omitDeepEach(dest, propPath) {
  if (!isArray(propPath)) {
    return;
  }

  var parentPath = propPath.slice(0, -1);
  var parentNode = getDeep(dest, parentPath);
  if (!parentNode) {
    return;
  }

  var lastProp = propPath[propPath.length - 1];
  if (isArray(lastProp)) {
    // This function doesn't allow to use an array as a property.
    return;
  }

  delete parentNode[lastProp];
}

module.exports = omitDeep;

},{"@fav/prop.assign-deep":2,"@fav/prop.get-deep":6,"@fav/type.is-array":7}],2:[function(require,module,exports){
'use strict';

var isPlainObject = require('@fav/type.is-plain-object');
var enumOwnProps = require('@fav/prop.enum-own-props');

function assignDeep(dest /* , ...src */) {
  if (!isPlainObject(dest)) {
    dest = {};
  }

  for (var i = 1, n = arguments.length; i < n; i++) {
    assignDeepEach(dest, arguments[i]);
  }
  return dest;
}

function assignDeepEach(dest, src) {
  var props = enumOwnProps(src);
  for (var i = 0, n = props.length; i < n; i++) {
    var prop = props[i];
    var srcValue = src[prop];

    if (isPlainObject(srcValue)) {
      var destValue = dest[prop];

      if (!isPlainObject(destValue)) {
        try {
          dest[prop] = destValue = {};
        } catch (e) {
          // If a property is read only, TypeError is thrown,
          // but this function ignore it.
        }
      }

      assignDeepEach(destValue, srcValue);
      continue;
    }

    try {
      dest[prop] = srcValue;
    } catch (e) {
      // If a property is read only, TypeError is thrown,
      // but this function ignore it.
    }
  }
}

module.exports = assignDeep;

},{"@fav/prop.enum-own-props":4,"@fav/type.is-plain-object":8}],3:[function(require,module,exports){
'use strict';

function enumOwnKeys(obj) {
  switch (typeof obj) {
    case 'object': {
      return Object.keys(obj || {});
    }
    case 'function': {
      return Object.keys(obj);
    }

    // Cause TypeError on Node.js v0.12 or earlier.
    case 'string': {
      return Object.keys(new String(obj));
    }
    default: {
      return [];
    }
  }
}

module.exports = enumOwnKeys;

},{}],4:[function(require,module,exports){
'use strict';

var enumOwnKeys = require('@fav/prop.enum-own-keys');
var enumOwnSymbols = require('@fav/prop.enum-own-symbols');

function enumOwnProps(obj) {
  return enumOwnKeys(obj).concat(enumOwnSymbols(obj));
}

module.exports = enumOwnProps;

},{"@fav/prop.enum-own-keys":3,"@fav/prop.enum-own-symbols":5}],5:[function(require,module,exports){
'use strict';

function enumOwnSymbols(obj) {
  /* istanbul ignore if */
  if (typeof Symbol !== 'function') {
    return [];
  }

  switch (typeof obj) {
    case 'object': {
      obj = obj || {};
      break;
    }
    case 'function': {
      break;
    }
    default: {
      return [];
    }
  }

  var symbols = Object.getOwnPropertySymbols(obj);
  for (var i = symbols.length - 1; i >= 0; i--) {
    var descriptor = Object.getOwnPropertyDescriptor(obj, symbols[i]);
    if (!descriptor.enumerable) {
      symbols.splice(i, 1);
    }
  }
  return symbols;
}

module.exports = enumOwnSymbols;

},{}],6:[function(require,module,exports){
'use strict';

var isArray = require('@fav/type.is-array');

function getDeep(obj, propPath) {
  if (arguments.length < 2) {
    return obj;
  }

  if (!isArray(propPath)) {
    return undefined;
  }

  if (obj == null) {
    return Boolean(propPath.length) ? undefined : obj;
  }

  for (var i = 0, n = propPath.length; i < n; i++) {
    var prop = propPath[i];
    if (Array.isArray(prop)) {
      // This function doesn't allow to use an array as a property.
      return undefined;
    }

    obj = obj[prop];
    if (obj == null) {
      break;
    }
  }

  return obj;
}

module.exports = getDeep;

},{"@fav/type.is-array":7}],7:[function(require,module,exports){
'use strict';

function isArray(value) {
  return Array.isArray(value);
}

function isNotArray(value) {
  return !Array.isArray(value);
}

Object.defineProperty(isArray, 'not', {
  enumerable: true,
  value: isNotArray,
});

module.exports = isArray;

},{}],8:[function(require,module,exports){
'use strict';

function isPlainObject(value) {
  if (typeof value !== 'object') {
    return false;
  }

  if (Object.prototype.toString.call(value) !== '[object Object]') {
    return false;
  }

  switch (Object.getPrototypeOf(value)) {
    case Object.prototype: {
      return true;
    }
    case null: {
      return true;
    }
    default: {
      return false;
    }
  }
}

function isNotPlainObject(value) {
  return !isPlainObject(value);
}

Object.defineProperty(isPlainObject, 'not', {
  enumerable: true,
  value: isNotPlainObject,
});

module.exports = isPlainObject;

},{}]},{},[1])(1)
});