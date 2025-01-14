Object.defineProperty(exports, "__esModule", {value: true});
exports.getBase16Theme = exports.createStyling = undefined;
var _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];
        for (var key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
                target[key] = source[key];
            }
        }
    }
    return target;
};
var _slicedToArray = function () {
    function sliceIterator(arr, i) {
        var _arr = [];
        var _n = true;
        var _d = false;
        var _e = undefined;
        try {
            for (var _i = arr[typeof Symbol === 'function' ? Symbol.iterator : '@@iterator'](), _s; !(_n = (_s = _i.next()).done); _n = true) {
                _arr.push(_s.value);
                if (i && _arr.length === i) break;
            }
        } catch (err) {
            _d = true;
            _e = err;
        } finally {
            try {
                if (!_n && _i["return"]) _i["return"]();
            } finally {
                if (_d) throw _e;
            }
        }
        return _arr;
    }

    return function (arr, i) {
        if (Array.isArray(arr)) {
            return arr;
        } else if ((typeof Symbol === 'function' ? Symbol.iterator : '@@iterator') in Object(arr)) {
            return sliceIterator(arr, i);
        } else {
            throw new TypeError("Invalid attempt to destructure non-iterable instance");
        }
    };
}();
var _lodash = require('lodash.curry');
var _lodash2 = _interopRequireDefault(_lodash);
var _base = require('@sishuguojixuefu/base16');
var base16 = _interopRequireWildcard(_base);
var _rgb2hex = require('pure-color/convert/rgb2hex');
var _rgb2hex2 = _interopRequireDefault(_rgb2hex);
var _parse = require('pure-color/parse');
var _parse2 = _interopRequireDefault(_parse);
var _lodash3 = require('lodash.flow');
var _lodash4 = _interopRequireDefault(_lodash3);

function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
        return obj;
    } else {
        var newObj = {};
        if (obj != null) {
            for (var key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
            }
        }
        newObj.default = obj;
        return newObj;
    }
}

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {default: obj};
}

function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
        for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
            arr2[i] = arr[i];
        }
        return arr2;
    } else {
        return Array.from(arr);
    }
}

var rgb = require('@grewer/color-space/rgb');
var yuv = require('@grewer/color-space/yuv');
var truthy = function truthy(x) {
    return x;
};
var DEFAULT_BASE16 = base16.default;
var BASE16_KEYS = Object.keys(DEFAULT_BASE16);
var flip = function flip(x) {
    return x < 0.25 ? 1 : x < 0.5 ? 0.9 - x : 1.1 - x;
};
var invertColor = (0, _lodash4.default)(_parse2.default, rgb.yuv, function (_ref) {
    var _ref2 = _slicedToArray(_ref, 3), y = _ref2[0], u = _ref2[1], v = _ref2[2];
    return [flip(y), u, v];
}, yuv.rgb, _rgb2hex2.default);
var invertThemeColors = function invertThemeColors(theme) {
    return Object.keys(theme).reduce(function (t, key) {
        return /^base/.test(key) ? (t[key] = invertColor(theme[key]), t) : t;
    }, {});
};
var getStylingByKeys = function getStylingByKeys(customStyling, defaultStyling, keys) {
    for (var _len = arguments.length, args = Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
        args[_key - 3] = arguments[_key];
    }
    if (keys === null) {
        return defaultStyling;
    }
    if (!Array.isArray(keys)) {
        keys = [keys];
    }
    var styles = keys.reduce(function (s, key) {
        return [].concat(_toConsumableArray(s), [defaultStyling[key], customStyling[key]]);
    }, []).filter(truthy);
    return styles.reduce(function (obj, s) {
        if (typeof s === 'string') {
            return _extends({}, obj, {
                className: [obj.className, s].filter(function (c) {
                    return c;
                }).join(' ')
            });
        } else if (typeof s === 'object') {
            return _extends({}, obj, {style: _extends({}, obj.style, s)});
        } else if (typeof s === 'function') {
            return _extends({}, obj, s.apply(undefined, [obj].concat(args)));
        } else {
            return obj;
        }
    }, {className: '', style: {}});
};
var createStyling = exports.createStyling = (0, _lodash2.default)(function (getStylingFromBase16) {
    for (var _len2 = arguments.length, args = Array(_len2 > 4 ? _len2 - 4 : 0), _key2 = 4; _key2 < _len2; _key2++) {
        args[_key2 - 4] = arguments[_key2];
    }
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var themeOrStyling = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var invertTheme = arguments[3];
    var _options$defaultBase = options.defaultBase16,
        defaultBase16 = _options$defaultBase === undefined ? DEFAULT_BASE16 : _options$defaultBase,
        _options$base16Themes = options.base16Themes,
        base16Themes = _options$base16Themes === undefined ? null : _options$base16Themes;
    var base16Theme = getBase16Theme(themeOrStyling, base16Themes);
    if (base16Theme) {
        themeOrStyling = _extends({}, base16Theme, themeOrStyling);
    }
    var theme = BASE16_KEYS.reduce(function (t, key) {
        return t[key] = themeOrStyling[key] || defaultBase16[key], t;
    }, {});
    var customStyling = Object.keys(themeOrStyling).reduce(function (s, key) {
        return BASE16_KEYS.indexOf(key) === -1 ? (s[key] = themeOrStyling[key], s) : s;
    }, {});
    var defaultStyling = getStylingFromBase16(invertTheme ? invertThemeColors(theme) : theme);
    return (0, _lodash2.default)(getStylingByKeys, 3).apply(undefined, [customStyling, defaultStyling].concat(args));
}, 4);
var getBase16Theme = exports.getBase16Theme = function getBase16Theme(theme, base16Themes) {
    if (theme && theme.extend) {
        theme = theme.extend;
    }
    if (typeof theme === 'string') {
        theme = (base16Themes || {})[theme] || base16[theme];
    }
    return theme && theme.hasOwnProperty('base00') ? theme : undefined;
};
