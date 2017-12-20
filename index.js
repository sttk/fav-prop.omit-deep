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
