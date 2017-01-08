"use strict";
/* For licensing information, refer to LICENSE.md. */

Phoenix.set({ openAtLogin: true });

var h_reload = new Key('r', ['alt'], function () {
    Phoenix.reload();
});

require('prefix-key.js');
require('move-window-prefix-key.js');
require('window-selector.js');

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
/* Can't bind the same key again, the keys clash. */
// wPrefix.addSuffix('space', ['ctrl', 'alt', 'cmd'], function () {});

/* Window Selector */

var windowSelector = new WindowSelector();
Key.on('return', ['ctrl', 'alt', 'cmd'], function () {
    windowSelector.show();
});

Phoenix.notify('Phoenix config loaded');
