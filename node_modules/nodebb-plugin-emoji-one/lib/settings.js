"use strict";

var _ = require("lodash");
var nconf = require("nconf");

var meta = require.main.require("./src/meta");
var packageJSON = require("../package.json");

/*
 * This file exports a NodeBB Settings Object and a few meta-data of the project.
 *
 * See https://docs.nodebb.org/en/latest/plugins/settings.html for more details on the Settings Object.
 *
 * This file by default gets meta-replaced (thus @{...} gets resolved within the grunt-tasks).
 * It is not recommended to add any more files, rather it is recommended to add additional exports here if needed.
 */

var env = "distribution",
    dev = env === "development";

/*===================================================== Exports  =====================================================*/

exports.urlBase = nconf.get("url") + "/plugins/nodebb-plugin-emoji-one/static";
exports.name = "nodebb-plugin-emoji-one";
exports.id = "emoji-one";
exports.Id = "EmojiOne";
exports.iD = "emojiOne";
exports.ID = "EMOJI_ONE";
exports.dev = dev;
exports.env = env;
exports.pkg = packageJSON;
exports.checkInit = checkInit;

/*==================================================== Functions  ====================================================*/

function checkInit(onInit) {
  meta.settings.get(exports.id, function (err, data) {
    if (!data || +data.initialized !== 1) {
      meta.settings.set(exports.id, { initialized: 1 }, _.noop);
      onInit();
    }
  });
}
