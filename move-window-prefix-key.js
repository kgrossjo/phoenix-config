/* For licensing information, refer to LICENSE.md. */

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

