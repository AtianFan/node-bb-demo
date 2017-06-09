"use strict";/*
 * This files gets called from the admin-page of the module to handle settings.
 *
 * Files within the public/static/scripts/ directory get meta-replaced by default (thus @{...} gets resolved within the
 * grunt-tasks).
 */
require(["settings"],function(a){function b(){e.is(":checked")?f.removeClass("hidden"):f.addClass("hidden")}var c="emoji-extended",d=$("#"+c+"-settings"),e=$("#"+c+"-completion"),f=$(".completion-group");
// synchronize settings instantly
a.sync(c,d,b),d.find("#"+c+"-settings-save").click(function(e){e.preventDefault(),a.persist(c,d,function(){b(),socket.emit("admin.settings.syncEmojiExtended")})}),d.find("#"+c+"-settings-reset").click(function(e){e.preventDefault(),a.sync(c,d,b)}),d.find("#"+c+"-settings-purge").click(function(e){e.preventDefault(),socket.emit("admin.settings.getEmojiExtendedDefaults",null,function(e,f){a.set(c,f,d,function(){b(),socket.emit("admin.settings.syncEmojiExtended")})})}),e.change(b)});