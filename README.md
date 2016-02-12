# phoenix-config

Just my personal Phoenix config.  I got inspired by Divvy, so I have implemented
the following functionality:

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
* <kbd>S</kbd> - move window to next screen, perserving relative size and position
* <kbd>Esc</kbd> - hit this if you don't want any action
