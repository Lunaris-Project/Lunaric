#!/usr/bin/env bash
XDG_CONFIG_HOME="${XDG_CONFIG_HOME:-$HOME/.config}"
XDG_STATE_HOME="${XDG_STATE_HOME:-$HOME/.local/state}"
CONFIG_DIR="$XDG_CONFIG_HOME/ags"
STATE_DIR="$XDG_STATE_HOME/ags"
colormodefile="$STATE_DIR/user/colormode.txt"
currentwallpaperfile="$STATE_DIR/user/current_wallpaper.txt"
currentwallpaper=`cat ${currentwallpaperfile}`
colormode=$(sed -n '3p' ${colormodefile})
lightdark=$(sed -n '1p' ${colormodefile})
# TODO make the colormode supply as arg after --switch 
main () {
    matugen image ${currentwallpaper} --type ${colormode} --mode ${lightdark}  
    swww img ${currentwallpaper}
}
main 
exit 0
