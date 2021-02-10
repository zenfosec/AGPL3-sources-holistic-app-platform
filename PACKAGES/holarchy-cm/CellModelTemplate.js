"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

// CellModelTemplate.js
(function () {
  var holarchy = require("@encapsule/holarchy");

  var constructorFilter = require("./lib/filters/cmt-method-constructor-filter");

  var CellModelTemplate = /*#__PURE__*/function (_holarchy$CellModelAr) {
    _inherits(CellModelTemplate, _holarchy$CellModelAr);

    var _super = _createSuper(CellModelTemplate);

    function CellModelTemplate(request_) {
      var _this;

      _classCallCheck(this, CellModelTemplate);

      var filterResponse = constructorFilter.request(request_);
      _this = _super.call(this, filterResponse.result);
      _this._private = !filterResponse.error ? _objectSpread(_objectSpread({}, _this._private), filterResponse.result) : {
        constructorError: filterResponse.error
      };
      _this.isValid = _this.isValid.bind(_assertThisInitialized(_this));
      _this.toJSON = _this.toJSON.bind(_assertThisInitialized(_this));
      _this.synthesizeCellModel = _this.synthesizeCellModel.bind(_assertThisInitialized(_this));
      return _this;
    }

    _createClass(CellModelTemplate, [{
      key: "isValid",
      value: function isValid() {
        return this._private.constructorError ? false : true;
      }
    }, {
      key: "toJSON",
      value: function toJSON() {
        return this.isValid() ? this._private : this._private.constructorError;
      }
    }, {
      key: "synthesizeCellModel",
      value: function synthesizeCellModel(request_) {
        return this.isValid() ? this._private.cellModelGeneratorFilter.request(_objectSpread({
          cmtInstance: this
        }, request_)) : {
          error: this.toJSON()
        };
      }
    }]);

    return CellModelTemplate;
  }(holarchy.CellModelArtifactSpace);

  module.exports = CellModelTemplate;
})();