"use strict";

/* For licensing information, refer to LICENSE.md. */
function WindowSelector() {
    this.modal = new Modal();
    this.modal.appearance = 'dark';
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
    this.keys.push(new Key('up', [], function () {
        that.selectPreviousWindow();
    }));
    this.keys.push(new Key('down', [], function () {
        that.selectNextWindow();
    }));
    this.keys.push(new Key('return', [], function () {
        that.focusWindow();
    }));
    this.keys.push(new Key('m', ['ctrl'], function () {
        that.focusWindow();
    }));
    this.keys.push(new Key('delete', [], function () {
        that.backspacePattern();
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
        var prefix = "";
        var suffix = "";
        if (this.selectedWindow == i) {
            prefix = "==> ";
            suffix = " <==";
        }
        lines.push(prefix + this.windowTitle(w) + suffix);
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
    this.disableKeys();
    this.modal.close();
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
WindowSelector.prototype.clearPattern = function () {
    this.initialize();
    this.updateUI();
};
WindowSelector.prototype.backspacePattern = function () {
    this.pattern = this.pattern.slice(0, -1);
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
    var result = new RegExp(new_re, 'i');
    return result;
};
WindowSelector.prototype.windowTitle = function (w) {
    return w.title() + " | " + w.app().name()
};
