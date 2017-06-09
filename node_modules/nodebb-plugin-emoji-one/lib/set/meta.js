"use strict";

var settings = require("../settings");

/*===================================================== Exports  =====================================================*/

exports.description = "Free and open source emoji.<br/>" + "<a href=\"http://emojione.com/\" target=\"_blank\">Image Source</a>";

exports.attribution = "Emoji provided free by <a href=\"http://emojione.com/\" target=\"_blank\">Emoji One</a>";

exports.preview = settings.urlBase + "/preview.png";

exports.url = [settings.urlBase + "/images/", { key: "file", encode: true }, ".svg"];
