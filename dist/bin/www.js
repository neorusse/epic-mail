"use strict";

var _app = _interopRequireDefault(require("../app"));

var _http = _interopRequireDefault(require("http"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _chalk = _interopRequireDefault(require("chalk"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Module dependencies
 */
// import env variables from our .env file
_dotenv.default.config(); // Start our App


_app.default.set('port', process.env.PORT || 1040);

var server = _http.default.createServer(_app.default);

server.listen(_app.default.get('port'), function () {
  console.log("Server running on PORT ".concat(_chalk.default.blue(server.address().port)));
});