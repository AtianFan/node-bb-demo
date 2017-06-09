"use strict";

var _ = require("lodash");
var Q = require("q");
var fs = require("fs");
var path = require("path");
var wrench = require("wrench");
var AdmZip = require("adm-zip");

var fsCommons = require("nodebb-plugin-emoji-extended/lib/commons/fs");
var downloadCommons = require("nodebb-plugin-emoji-extended/lib/commons/download");
var index = require("./index");

var ARCHIVE = "http://emojione.com/wp-content/uploads/assets/e1-svg.zip";
var FILES_PREFIX = "https://raw.githubusercontent.com/Ranks/emojione/master/";

var updating = null;

/*===================================================== Exports  =====================================================*/

module.exports = update;

/*==================================================== Functions  ====================================================*/

function update(assetsPath) {
  if (updating == null) {
    updating = flow(assetsPath);
    updating.done(updateDone, updateDone);
  }
  return updating;
}

function flow(assetsPath) {
  return downloadSVGFiles(assetsPath).then(function () {
    return downloadStaticFiles(assetsPath);
  }).then(function () {
    return index.build(assetsPath);
  });
}

function downloadSVGFiles(assetsPath) {
  wrench.mkdirSyncRecursive(path.resolve(assetsPath, ".."));
  var tmpPath = path.join(assetsPath, "..", "." + path.basename(assetsPath));
  return Q.nfcall(fsCommons.access, tmpPath, fs.F_OK).then(function () {
    wrench.rmdirSyncRecursive(tmpPath);
  }, _.noop).then(function () {
    return downloadCommons.buffer(ARCHIVE);
  }).then(function (buf) {
    var zip = new AdmZip(buf);
    zip.extractAllTo(tmpPath, true);
    return Q.nfcall(fsCommons.access, assetsPath, fs.F_OK).then(function () {
      wrench.rmdirSyncRecursive(assetsPath);
    }, _.noop).then(function () {
      return Q.nfcall(fs.rename, path.join(tmpPath, "svg"), assetsPath);
    }).then(function () {
      wrench.rmdirRecursive(tmpPath);
    });
  });
}

function downloadStaticFiles(assetsPath) {
  return downloadCommons.buffer(FILES_PREFIX + "LICENSE.md", true).then(function (buf) {
    var content = buf.toString();
    var match = /(#### Emoji One Artwork[\s\S]*)####/mi.exec(content);
    return Q.nfcall(fs.writeFile, path.join(assetsPath, "LICENSE.md"), match == null ? content : match[1].trim());
  });
}

function updateDone() {
  updating = null;
}
