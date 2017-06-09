"use strict";

var _ = require("lodash");
var Q = require("q");
var fs = require("fs");
var path = require("path");
var wrench = require("wrench");

var fsCommons = require("nodebb-plugin-emoji-extended/lib/commons/fs");
var parserCommons = require("nodebb-plugin-emoji-extended/lib/commons/parser");
var meta = require("./meta");
var index = require("./update/index");
var update = require("./update/main");
var mapping = require("./mapping");
var settings = require("../settings");

var BASE_PATH = path.resolve(path.dirname(module.filename), "../..");
var ASSETS_PATH = path.join(BASE_PATH, "public/static/images");
var URL = settings.urlBase + "/images";

var opts = {};
var aliasMap = {};

/*===================================================== Exports  =====================================================*/

exports.url = meta.url;
exports.name = settings.pkg.nbbpm.name;
exports.preview = meta.preview;
exports.mapping = mapping;
exports.license = null;
exports.moduleId = settings.name;
exports.description = meta.description;
exports.attribution = meta.attribution;

exports.mainStyles = function () {
  return fs.readFileSync(path.join(BASE_PATH, "public/static/styles/main.css"));
};
exports.emailStyles = function () {
  return fs.readFileSync(path.join(BASE_PATH, "public/static/styles/email.css"));
};

exports.use = use;
exports.parse = _.identity;
exports.purge = function () {
  wrench.rmdirSyncRecursive(ASSETS_PATH, true);
};
exports.update = updateWrapper;
exports.prepared = prepared;

/*==================================================== Functions  ====================================================*/

function use(options) {
  aliasMap = {};
  opts = options;
  opts.parser = parser;
  // generate emoji list
  return generateList().then(function (list) {
    // export new parse function
    exports.parse = parserCommons.genParser(URL, opts);
    return list;
  });
}

function updateWrapper() {
  return update(ASSETS_PATH).then(generateList);
}

function prepared() {
  try {
    fsCommons.accessSync(path.join(ASSETS_PATH, "index.json"), fs.F_OK);
    return true;
  } catch (e) {
    return false;
  }
}

function generateList() {
  return index.read(ASSETS_PATH).then(function (list) {
    list = _.filter(list, function (item) {
      return !_.includes(opts.excludes, item.id);
    });
    opts.fileById = _.chain(list).mapKeys("id").mapValues("file").value();
    opts.list = _.chain(list).map("id").concat(_.chain(list).map(function (item) {
      return _.each(item.aliases, function (alias) {
        aliasMap[alias] = item.id;
      }) || [];
    }).flatten().value()).value();
    return list;
  }).then(function (list) {
    return readLicense().then(_.constant(list));
  });
}

function readLicense() {
  return Q.nfcall(fs.readFile, path.join(ASSETS_PATH, "LICENSE.md")).then(function (license) {
    exports.license = license.toString();
  });
}

function parser(match, url, options) {
  var id = match[1],
      isAlias = aliasMap.hasOwnProperty(id),
      realId = isAlias ? aliasMap[id] : id;
  var res = "<img src=\"" + url + "/" + encodeURIComponent(options.fileById[realId]) + ".svg\" ";
  for (var key in options.attributes) {
    //noinspection JSUnfilteredForInLoop
    res += key + "=\"" + options.attributes[key].apply(options, match) + "\" ";
  }
  if (isAlias) {
    res += "data-alias-of=\"" + realId + "\"";
  }
  return res + "/>";
}
