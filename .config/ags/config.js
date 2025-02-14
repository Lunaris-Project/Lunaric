import { Utils, App, Notifications } from './src/utils/imports.js';
import { Bar } from './src/topbar.js';
import { MainMenu } from './src/components/menus/MainMenu.js';
import { VolumeOSD } from './src/components/on-screen/volume.js';
import MyNotifications from './src/components/notifications/OSDNotifications.js';
import { PrayerTimesMenu } from './src/components/menus/PrayerTimesMenu.js';
import ColorWidget from './src/components/widgets/desktop/ColorsWidget.js';
import win20Widget from './src/components/widgets/desktop/Win20Widget.js';
import materialWidget from './src/components/widgets/desktop/MaterialYouOne.js';
import unicatWidget from './src/components/widgets/desktop/UnicatWidget.js';
import blackHoleWidget from './src/components/widgets/desktop/BlackHole.js';
import goldenWidget from './src/components/widgets/desktop/Golden.js';
import harmonyWidget from './src/components/widgets/desktop/Harmony.js';
import newCatWidget from './src/components/widgets/desktop/NewCat.js';
import deerWidget from './src/components/widgets/desktop/DeerWidget.js';
import circlesMusicWidget from './src/components/widgets/desktop/Circles.js';
import whiteFlowerWidget from './src/components/widgets/desktop/WhiteFlower.js';
import { CalendarMenu } from './src/components/menus/CalendarMenu.js';
import settings from './src/settings/settings.js';
import { applauncher } from './src/components/menus/ApplicationsMenu.js';

import {
    TopLeftCorner,
    TopRightCorner,
} from './src/components/ScreenCorners.js';
import { languageLayoutOSD } from './src/components/on-screen/KeyboardLayout.js';

// in config.js
const scss = '~/.config/ags/src/styles/main.scss';
const css = '~/.config/ags/style.css';

Utils.exec(`sassc ${scss} ${css}`);

let windows = [
    VolumeOSD(),
    MyNotifications(),
    PrayerTimesMenu(),
    CalendarMenu(),
    languageLayoutOSD,
    // ... Desktop widgets ... //
    ColorWidget,
    win20Widget,
    materialWidget,
    unicatWidget,
    blackHoleWidget,
    goldenWidget,
    harmonyWidget,
    newCatWidget,
    deerWidget,
    circlesMusicWidget,
    whiteFlowerWidget,
    applauncher,
];

const screens = JSON.parse(Utils.exec('hyprctl monitors all -j'));

for (let i = 0; i < screens.length; i++) {
    const screen = screens[i];

    windows.push(Bar({ monitor: screen.id }));

    const leftMene = MainMenu({ monitor: screen.id });
    windows.push(leftMene);
    windows.push(TopLeftCorner({ monitor: screen.id }));
    windows.push(TopRightCorner({ monitor: screen.id }));
}

Notifications.cacheActions;
globalThis.getNot = () => Notifications;

Utils.execAsync([`paplay`, settings.assets.audio.desktop_login]).catch(print);

Utils.execAsync([
    'python',
    settings.scripts.createThumbnail,
    settings.theme.darkM3WallpaperPath,
]).catch(print);

Utils.execAsync([
    'python',
    settings.scripts.createThumbnail,
    settings.theme.lightM3WallpaperPath,
]).catch(print);

App.config({
    css: css,
    windows: windows,
});
