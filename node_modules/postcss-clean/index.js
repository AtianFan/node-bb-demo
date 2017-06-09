'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var postcss = _interopDefault(require('postcss'));
var CleanCss = _interopDefault(require('clean-css'));

var initializer = function initializer() {
  var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var cleancss = new CleanCss(opts);

  return function (css, res) {
    return new Promise(function (resolve, reject) {
      cleancss.minify(css.toString(), function (err, min) {
        if (err) {
          return reject(new Error(err.join('\n')));
        }

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = min.warnings[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var w = _step.value;

            res.warn(w);
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        res.root = postcss.parse(min.styles);
        resolve();
      });
    });
  };
};

var index_m = postcss.plugin('clean', initializer);

module.exports = index_m;