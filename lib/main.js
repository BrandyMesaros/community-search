"use strict";

var _vue = _interopRequireDefault(require("vue"));

var _App = _interopRequireDefault(require("./App.vue"));

require("bootstrap/dist/css/bootstrap.min.css");

require("./assets/main.scss");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_vue.default.config.productionTip = false;

_vue.default.filter('toCurrency', function (value) {
  if (typeof value !== "number") {
    return value;
  }

  var formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  });
  return formatter.format(value);
});

new _vue.default({
  render: h => h(_App.default)
}).$mount('#app');