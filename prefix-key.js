"use strict";

/* Support a prefix key with multiple suffix keys */
/* For licensing information, refer to LICENSE.md. */

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
