"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _morgan = _interopRequireDefault(require("morgan"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _cors = _interopRequireDefault(require("cors"));

require("@babel/polyfill");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Module dependencies
 */
// Enables node runtime to recognise async/await and Promise
// Initialize the Express App
var app = new _express.default(); // logs HTTP requests

app.use((0, _morgan.default)('dev')); // Takes the raw request and turns them into usable properties of req.body

app.use(_bodyParser.default.json());
app.use(_bodyParser.default.urlencoded({
  extended: true
})); // Allows Cross Origin Resource Sharing

app.use((0, _cors.default)()); // Route Route

app.get('/', function (req, res) {
  res.status(200).send({
    info: 'Welcome to EPICMail'
  });
}); // Catch 404 Error & forward to Error Handler

app.use(function (req, res, next) {
  var error = new Error('Not found');
  error.status = 404;
  next(error);
}); // Error Handler

app.use(function (error, req, res, next) {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});
var _default = app;
exports.default = _default;