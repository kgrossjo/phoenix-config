# phoenix-config

For licensing information, refer to LICENSE.md.

Just my personal Phoenix config.  There are two main functions here,
the first is window management / manipulation inspired by Divvy.  The second
is a window selector.

June, 2017: I have stopped using Phoenix for now, I have started using
Hammerspoon.  But Dai Zeng was interested and he has a repository here:
https://github.com/daizeng1984/phoenix-config

## Window Management

You hit a prefix key.  Then a popup shows up that explains which keys to press
and what they do.  Each key moves the currently focused window to a preset
position with a preset size.

<kbd>ctrl-alt-cmd-space</kbd> is the prefix key, then you can hit:

* <kbd>H</kbd> - moves the window to the left half of the screen
* <kbd>L</kbd> - moves the window to the right half of the screen
* <kbd>G</kbd> - window width is 70%, height 100%, center of screen
* <kbd>M</kbd> - maximize window (width 100%, height 100%)
* <kbd>O</kbd> - nearly maximize window (width 90%, height 100%, left side of screen)
* <kbd>P</kbd> - nearly maximize window (width 90%, height 100%, right side of screen)
* <kbd>Shift-O</kbd> - like <kbd>O</kbd>, but width 80%
* <kbd>Shift-P</kbd> - like <kbd>P</kbd>, but width 80%
* <kbd>S</kbd> - move window to next screen, perserving relative size and position
* <kbd>Esc</kbd> - hit this if you don't want any action

## Window Selector

You hit a prefix key.  A list of all windows shows up, in "most recently used"
order.  You enter a filter.  The window list shrinks accordingly.  You move down
or up the list of matching windows using Tab and Shift+Tab, and you hit Return
to select the currently selected window.

I don't know a good term to describe how filtering works.  The letters have to
appear in the order shown, but they don't need to be adjacent.  For example, the
filter "abc" matches a window "xAxBxCx".

* <kbd>Ctrl-U</kbd> - clears the pattern
* <kbd>Ctrl-P</kbd> - selects previous match
* <kbd>Shift-Tab</kbd> - ditto
* <kbd>Ctrl-N</kbd> - selects the next match
* <kbd>Tab</kbd> - ditto
* <kbd>Return</kbd> - selects current window
