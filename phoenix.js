"use strict";

Phoenix.set({ openAtLogin: true });

var h_reload = new Key('r', ['alt'], function () {
    Phoenix.reload();
});

/* Support a prefix key with multiple suffix keys */

function PrefixKey(key, modifiers, description) {
    this.modal = this.centeredModal(description);
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
            // Phoenix.reload();
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
PrefixKey.prototype.centeredModal = function (message) {
    var result = new Modal();
    result.text = message;
    var screen_frame = Screen.main().frameInRectangle();
    var result_frame = result.frame();
    result.origin = {
        x: 0.5 * (screen_frame.width - result_frame.width),
        y: 0.5 * (screen_frame.height - result_frame.height),
    };
    return result;
};

function MoveWindowPrefixKey(key, modifiers, description) {
    PrefixKey.call(this, key, modifiers, description);
}
MoveWindowPrefixKey.prototype = Object.create(PrefixKey.prototype);

MoveWindowPrefixKey.prototype.moveWindow = function (rect, screen) {
    screen = screen || Screen.main();
    var scr = screen.visibleFrameInRectangle();
    var r = {
        x: Math.round(scr.x + rect.x*scr.width),
        y: Math.round(scr.y + rect.y*scr.height),
        width: Math.round(scr.width * rect.width),
        height: Math.round(scr.height * rect.height),
    };
    Window.focused().setFrame(r);
};
MoveWindowPrefixKey.prototype.moveWindowToNextScreen = function () {
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
    this.moveWindow(relative, nextScreen);
};


/* Window handling prefix key */

var wPrefix = new MoveWindowPrefixKey('space', ['ctrl', 'alt', 'cmd'],
    "h/l - Left/Right Half\nn - Centered Half Width\nc - Center\ng - Wide Center\nm - Max\no/p - big left/right\nO/P - medium left/right\n1/2 - top left/right\n3/4 - bottom left/right\ns - next screen\nr - reload\nesc - Abort");
wPrefix.addSuffix('h', [], function () {
    wPrefix.moveWindow({x: 0, y: 0, width: 0.5, height: 1.0});
});
wPrefix.addSuffix('l', [], function () {
    wPrefix.moveWindow({x: 0.5, y: 0, width: 0.5, height: 1.0});
});
wPrefix.addSuffix('n', [], function () {
    wPrefix.moveWindow({x: 0.25, y: 0, width: 0.5, height: 1.0});
});
wPrefix.addSuffix('g', [], function () {
    wPrefix.moveWindow({x: 0.15, y: 0, width: 0.7, height: 1.0});
});
wPrefix.addSuffix('m', [], function () {
    wPrefix.moveWindow({x: 0, y: 0, width: 1.0, height: 1.0});
});
wPrefix.addSuffix('c', [], function () {
    wPrefix.moveWindow({x: 0.2, y: 0.2, width: 0.6, height: 0.6});
});
wPrefix.addSuffix('o', [], function () {
    wPrefix.moveWindow({x: 0, y: 0, width: 0.9, height: 1.0});
});
wPrefix.addSuffix('o', ['shift'], function () {
    wPrefix.moveWindow({x: 0, y: 0, width: 0.8, height: 1.0});
});
wPrefix.addSuffix('p', [], function () {
    wPrefix.moveWindow({x: 0.1, y: 0, width: 0.9, height: 1.0});
});
wPrefix.addSuffix('p', ['shift'], function () {
    wPrefix.moveWindow({x: 0.2, y: 0, width: 0.8, height: 1.0});
});
wPrefix.addSuffix('s', [], function () {
    wPrefix.moveWindowToNextScreen();
});
wPrefix.addSuffix('1', [], function () {
    wPrefix.moveWindow({x: 0.0, y: 0.0, width: 0.5, height: 0.5});
});
wPrefix.addSuffix('2', [], function () {
    wPrefix.moveWindow({x: 0.5, y: 0.0, width: 0.5, height: 0.5});
});
wPrefix.addSuffix('3', [], function () {
    wPrefix.moveWindow({x: 0.0, y: 0.5, width: 0.5, height: 0.5});
});
wPrefix.addSuffix('4', [], function () {
    wPrefix.moveWindow({x: 0.5, y: 0.5, width: 0.5, height: 0.5});
});
wPrefix.addSuffix('r', [], function () { Phoenix.reload(); });
wPrefix.addSuffix('escape', [], function () {});
wPrefix.addSuffix('space', ['ctrl', 'alt', 'cmd'], function () {});

/* Window Selector */

function WindowSelector() {
    this.modal = new Modal();

    var screen_frame = Screen.main().frameInRectangle();
    this.modal.origin = {
        x: screen_frame.x + 100,
        y: screen_frame.height - 100,
    };
    this.initialize();
    this.setupKeys();
}
WindowSelector.prototype.initialize = function () {
    var that = this;
    this.windowList = Window.recent();
    this.pattern = '';
    this.selectedWindow = 0;
    this.matching = [];
    this.windowList.forEach(function (w) {
        that.matching.push(true);
    });
};
WindowSelector.prototype.setupKeys = function () {
    this.keys = [];
    var that = this;
    this.keys.push(new Key('escape', [], function () {
        that.dismiss();
    }));
    this.keys.push(new Key('tab', [], function () {
        that.selectNextWindow();
    }));
    this.keys.push(new Key('tab', ['shift'], function () {
        that.selectPreviousWindow();
    }));
    this.keys.push(new Key('u', ['ctrl'], function () {
        that.clearPattern();
    }));
    this.keys.push(new Key('p', ['ctrl'], function () {
        that.selectPreviousWindow();
    }));
    this.keys.push(new Key('n', ['ctrl'], function () {
        that.selectNextWindow();
    }));
    this.keys.push(new Key('return', [], function () {
        that.focusWindow();
    }));
    [
        'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
        'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't',
        'u', 'v', 'w', 'x', 'y', 'z'
    ].forEach( function (key) {
        that.keys.push(new Key(key, [], function () {
            that.addToPattern(key);
        }));
        that.keys.push(new Key(key, ['shift'], function () {
            that.addToPattern(key.toUpperCase());
        }));
    });
    [
        '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
        '.', ',', '/', '-', '_'
    ].forEach( function (key) {
        that.keys.push(new Key(key, [], function () {
            that.addToPattern(key);
        }));
    });
    this.disableKeys();
};
WindowSelector.prototype.updateUI = function () {
    var lines = [];
    lines.push("> " + this.pattern);
    lines.push("");
    for (var i=0; i<this.windowList.length; i++) {
        var w = this.windowList[i];
        var m = this.matching[i];
        if (!m) continue;
        var prefix = "- ";
        if (this.selectedWindow == i) prefix = "# ";
        lines.push(prefix + this.windowTitle(w));
    }
    this.modal.text = lines.join("\n");
};
WindowSelector.prototype.show = function () {
    this.pattern = '';
    this.initialize();
    this.updateUI();
    this.modal.show();
    this.enableKeys();
};
WindowSelector.prototype.dismiss = function () {
    this.modal.close();
    this.disableKeys();
};
WindowSelector.prototype.updateMatches = function () {
    var regex = this.getRegexForPattern(this.pattern);
    for (var i=0; i<this.windowList.length; i++) {
        var w = this.windowList[i];
        this.matching[i] = regex.test(this.windowTitle(w));
    }
};
WindowSelector.prototype.addToPattern = function (key) {
    this.pattern += key;
    this.updateMatches();
    this.selectedWindow = 0;
    this.updateUI();
};
WindowSelector.prototype.selectNextWindow = function () {
    var nWindows = this.windowList.length;
    var startingPoint = this.selectedWindow;
    do {
        this.selectedWindow = (1 + this.selectedWindow) % nWindows;
    } while (this.selectedWindow != startingPoint && ! this.matching[this.selectedWindow]);
    this.updateUI();
};
WindowSelector.prototype.selectPreviousWindow = function () {
    var nWindows = this.windowList.length;
    var startingPoint = this.selectedWindow;
    do {
        this.selectedWindow = (-1 + this.selectedWindow) % nWindows;
    } while (this.selectedWindow != startingPoint && ! this.matching[this.selectedWindow]);
    this.updateUI();
};
WindowSelector.prototype.clearPattern = function () {
    this.initialize();
    this.updateUI();
};
WindowSelector.prototype.focusWindow = function () {
    this.windowList[this.selectedWindow].focus();
    this.dismiss();
};
WindowSelector.prototype.enableKeys = function () {
    this.keys.forEach(function (x) {
        x.enable();
    });
};
WindowSelector.prototype.disableKeys = function () {
    this.keys.forEach(function (x) {
        x.disable();
    });
};
WindowSelector.prototype.getRegexForPattern = function (pattern) {
    var chars = pattern.split("");
    var new_re = chars.join(".*");
    var result = new RegExp(new_re);
    return result;
};
WindowSelector.prototype.windowTitle = function (w) {
    return w.title() + " | " + w.app().name()
};


var windowSelector = new WindowSelector();
Key.on('return', ['ctrl', 'alt', 'cmd'], function () {
    windowSelector.show();
});
