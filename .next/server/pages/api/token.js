module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = require('../../ssr-module-cache.js');
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete installedModules[moduleId];
/******/ 		}
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ({

/***/ 2:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("BvaT");


/***/ }),

/***/ "BvaT":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var jsonwebtoken__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("tMJi");
/* harmony import */ var jsonwebtoken__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(jsonwebtoken__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var uuid4__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("GQty");
/* harmony import */ var uuid4__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(uuid4__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("X7BR");




const generateToken = ({
  token_variables,
  secret,
  customer_id,
  res
}) => {
  jsonwebtoken__WEBPACK_IMPORTED_MODULE_0___default.a.sign(token_variables, secret, {
    algorithm: 'HS256',
    expiresIn: '24h',
    issuer: customer_id,
    jwtid: uuid4__WEBPACK_IMPORTED_MODULE_1___default()()
  }, function (error, token) {
    if (error) {
      res.status(400).json({
        error
      });
    } else {
      res.status(200).json({
        token
      });
    }
  });
};

/* harmony default export */ __webpack_exports__["default"] = (async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  let payload;

  try {
    payload = JSON.parse(req.body);
  } catch (error) {
    res.status(400).json({
      error
    });
    return;
  }

  var {
    room_id,
    user_name,
    peer_id,
    env,
    role
  } = payload;
  let user_id;

  if (user_name) {
    user_id = uuid4__WEBPACK_IMPORTED_MODULE_1___default()() + user_name;
  } else {
    user_id = uuid4__WEBPACK_IMPORTED_MODULE_1___default()() + peer_id; //To be deprecated. This peer_id is incorrectly named
  }

  if (env in _constants__WEBPACK_IMPORTED_MODULE_2__[/* envMapping */ "c"]) {
    const customer_id = process.env['CUSTOMER_ID'];
    const secret = process.env['APP_SECRET'];
    const access_key = process.env['APP_ACCESS_KEY'];
    const app_id = process.env['APP_ID'];
    const token_variables = {
      access_key: access_key,
      app_id: app_id,
      room_id: room_id,
      user_id: user_id,
      role: role
    };
    generateToken({
      token_variables,
      secret,
      customer_id,
      res
    });
  } else {
    res.status(400).json({
      error: {
        message: 'Wrong env specified'
      }
    });
  }
});

/***/ }),

/***/ "GQty":
/***/ (function(module, exports) {

module.exports = require("uuid4");

/***/ }),

/***/ "X7BR":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return ROLES; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ENVS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return envMapping; });
const ROLES = {
  HOST: 'host',
  GUEST: 'guest',
  LIVE_RECORD: 'live-record',
  VIEWER: 'viewer'
};
const ENVS = {
  QA: 'qa-in',
  PROD: 'prod-in',
  STAGING: 'staging-in',
  DEV3: 'dev3-in'
};
const envMapping = {
  'staging-in': 'STAGING_IN',
  'qa-in': 'QA_IN',
  'dev3-in': 'QA_IN',
  'prod-in': 'PROD_IN'
};

/***/ }),

/***/ "tMJi":
/***/ (function(module, exports) {

module.exports = require("jsonwebtoken");

/***/ })

/******/ });