"use strict";

function centered_modal(message) {
    var result = new Modal();
    result.message = message;
    var screen_frame = Screen.mainScreen().frameInRectangle();
    var result_frame = result.frame();
    result.origin = {
        x: 0.5 * (screen_frame.width - result_frame.width),
        y: 0.5 * (screen_frame.height - result_frame.height),
    };
    return result;
}

var h_reload = Phoenix.bind('r', ['alt'], function () {
    Phoenix.reload();
});

/* Window Handling */

function move_window(rect) {
    var scr = Screen.mainScreen().visibleFrameInRectangle();
    var r = {
        x: Math.round(scr.x + rect.x*scr.width),
        y: Math.round(scr.y + rect.y*scr.height),
        width: Math.round(scr.width * rect.width),
        height: Math.round(scr.height * rect.height),
    };
    Window.focusedWindow().setFrame(r);
}

/* New-style prefix keys, WIP */
function PrefixKey(key, modifiers, description) {
    this.modal = centered_modal(description);
    this.suffixes = [];
    var that = this;
    this.prefix = Phoenix.bind(key, modifiers, function () {
        that.enableSuffixes();
        that.modal.show();
    });
}
PrefixKey.prototype.enableSuffixes = function () {
    this.suffixes.forEach(function (x) {
        x.enable();
    });
};
PrefixKey.prototype.disableSuffixes = function () {
    this.suffixes.forEach(function (x) {
        x.disable();
    });
};
PrefixKey.prototype.addSuffix = function (key, modifiers, cb) {
    var that = this;
    var result = Phoenix.bind(key, modifiers, function () {
        cb();
        that.modal.close();
        that.disableSuffixes();
    });
    result.disable();
    this.suffixes.push(result);
    return result;
}
var gPrefix = new PrefixKey('space', ['alt'], "h - Left Half\nl - Right Half\ng - Wide Center\nm - Max\nesc - Abort");
var gLeft = gPrefix.addSuffix('h', [], function () {
    move_window({x: 0, y: 0, width: 0.5, height: 1.0});
});
var gRight = gPrefix.addSuffix('l', [], function () {
    move_window({x: 0.5, y: 0, width: 0.5, height: 1.0});
});
var gCenter = gPrefix.addSuffix('g', [], function () {
    move_window({x: 0.15, y: 0, width: 0.7, height: 1.0});
});
var gMax = gPrefix.addSuffix('m', [], function () {
    move_window({x: 0, y: 0, width: 1.0, height: 1.0});
});
var gEscape = gPrefix.addSuffix('escape', [], function () {});

