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

/* Support a prefix key with multiple suffix keys */

function PrefixKey(key, modifiers, description) {
    this.modal = centered_modal(description);
    this.suffixes = [];
    this.handlers = [];
    var that = this;
    this.prefix = Phoenix.bind(key, modifiers, function () {
        that.enableSuffixes();
        that.modal.show();
    });
}

PrefixKey.prototype.enableSuffixes = function () {
    var that = this;
    this.suffixes.forEach(function (x) {
        var h = Phoenix.bind(x.key, x.modifiers, function () {
            x.cb();
            that.disableSuffixes();
            that.modal.close();
        });
        h.enable();
    });
};
PrefixKey.prototype.disableSuffixes = function () {
    this.handlers.forEach( function (x) {
        x.disable();
    });
    this.handlers = [];
};
PrefixKey.prototype.addSuffix = function (key, modifiers, cb) {
    this.suffixes.push({key: key, modifiers: modifiers, cb: cb});
};

/* Window handling prefix key */

var wPrefix = new PrefixKey('space', ['alt'], "h - Left Half\nl - Right Half\ng - Wide Center\nm - Max\nesc - Abort");
wPrefix.addSuffix('h', [], function () {
    move_window({x: 0, y: 0, width: 0.5, height: 1.0});
});
wPrefix.addSuffix('l', [], function () {
    move_window({x: 0.5, y: 0, width: 0.5, height: 1.0});
});
wPrefix.addSuffix('g', [], function () {
    move_window({x: 0.15, y: 0, width: 0.7, height: 1.0});
});
wPrefix.addSuffix('m', [], function () {
    move_window({x: 0, y: 0, width: 1.0, height: 1.0});
});
wPrefix.addSuffix('n', [], function () {
    move_window({x: 0.1, y:0, width: 0.9, height: 1.0});
});
wPrefix.addSuffix('c', [], function () {
    move_window({x: 0.2, y: 0.2, width: 0.6, height: 0.6});
});
wPrefix.addSuffix('escape', [], function () {});

