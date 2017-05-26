if (typeof(L) === "undefined") {
  L = {};
}

L.Pie = {
  version: '0.1.0',
  Control: {},
  Util: {}
};

if (typeof module === 'object' && typeof module.exports === 'object') {
  module.exports = L.Pie;
} else if (typeof define === 'function' && define.amd) {
  define(L.Pie);
}
