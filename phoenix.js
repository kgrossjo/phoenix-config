"use strict";

function centered_modal(message) {
    var result = new Modal();
    result.message = message;
    var screen_frame = Screen.main().frameInRectangle();
    var result_frame = result.frame();
    result.origin = {
        x: 0.5 * (screen_frame.width - result_frame.width),
        y: 0.5 * (screen_frame.height - result_frame.height),
    };
    return result;
}

var h_reload = new Key('r', ['alt'], function () {
    Phoenix.reload();
});

/* Window Handling */

function move_window(rect, screen) {
    screen = screen || Screen.main();
    var scr = screen.visibleFrameInRectangle();
    var r = {
        x: Math.round(scr.x + rect.x*scr.width),
        y: Math.round(scr.y + rect.y*scr.height),
        width: Math.round(scr.width * rect.width),
        height: Math.round(scr.height * rect.height),
    };
    Window.focused().setFrame(r);
}

function move_window_to_next_screen() {
    var currW = Window.focused();
    var cwFrame = currW.frame();
    var currScreen = currW.screen();
    var nextScreen = currScreen.next();
    var currScreenSize = currScreen.visibleFrameInRectangle();
    var relative = {
        x: (cwFrame.x - currScreenSize.x) / currScreenSize.width,
        y: (cwFrame.y - currScreenSize.y) / currScreenSize.height,
        width: cwFrame.width / currScreenSize.width,
        height: cwFrame.height / currScreenSize.height,
    };
    move_window(relative, nextScreen);
}

/* Spaces */



/* Support a prefix key with multiple suffix keys */

function PrefixKey(key, modifiers, description) {
    this.modal = centered_modal(description);
    this.suffixes = [];
    this.handlers = [];
    var that = this;
    this.prefix = new Key(key, modifiers, function () {
        that.enableSuffixes();
        that.modal.show();
    });
}

PrefixKey.prototype.enableSuffixes = function () {
    var that = this;
    this.suffixes.forEach(function (x) {
        var h = new Key(x.key, x.modifiers, function () {
            that.disableSuffixes();
            x.cb();
            that.modal.close();
            Phoenix.reload();
        });
        h.enable();
        that.handlers.push(h);
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

var wPrefix = new PrefixKey('space', ['ctrl', 'alt', 'cmd'],
    "h/l - Left/Right Half\nc - Center\ng - Wide Center\nm - Max\no/p - big left/right\nO/P - medium left/right\ns - next screen\nesc - Abort");
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
wPrefix.addSuffix('c', [], function () {
    move_window({x: 0.2, y: 0.2, width: 0.6, height: 0.6});
});
wPrefix.addSuffix('o', [], function () {
    move_window({x: 0, y: 0, width: 0.9, height: 1.0});
});
wPrefix.addSuffix('o', ['shift'], function () {
    move_window({x: 0, y: 0, width: 0.8, height: 1.0});
});
wPrefix.addSuffix('p', [], function () {
    move_window({x: 0.1, y: 0, width: 0.9, height: 1.0});
});
wPrefix.addSuffix('p', ['shift'], function () {
    move_window({x: 0.2, y: 0, width: 0.8, height: 1.0});
});
wPrefix.addSuffix('s', [], function () {
    move_window_to_next_screen();
});
wPrefix.addSuffix('escape', [], function () {});
wPrefix.addSuffix('space', ['ctrl', 'alt', 'cmd'], function () {});

