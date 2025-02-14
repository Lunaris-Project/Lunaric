#!/usr/bin/env bun
import { $ } from "bun";
import { mkdirSync } from "fs";
import { homedir } from "os";
import { join } from "path";

const SAVE_DIR = join(homedir(), "Pictures", "Screenshots");
const DATE_FORMAT =
  new Date()
    .toISOString()
    .replace(/[-:]/g, "")
    .replace("T", "_")
    .replace(/\..+/, "") + "_screenshot.png";
const SCREENSHOT_FILE = join(SAVE_DIR, DATE_FORMAT);

interface HyprctlResponse {
  int: number;
}

interface Monitor {
  name: string;
  focused: boolean;
}

mkdirSync(SAVE_DIR, { recursive: true });

async function copyToClipboard(file: string) {
  try {
    await $`wl-copy -t image/png < ${file}`;
    return true;
  } catch (error) {
    console.error("Error copying to clipboard:", error);
    return false;
  }
}

async function sendNotification(file: string, message: string) {
  try {
    await $`notify-send -i ${file} "Screenshot" ${message}`;
    return true;
  } catch (error) {
    console.error("Error sending notification:", error);
    return false;
  }
}

async function captureFullScreen(): Promise<boolean> {
  try {
    await $`grim ${SCREENSHOT_FILE}`;
    return true;
  } catch (error) {
    console.error("Error capturing full screen:", error);
    return false;
  }
}

async function captureActiveMonitor(): Promise<boolean> {
  try {
    const monitorsJson = await $`hyprctl monitors -j`.text();
    const monitors = JSON.parse(monitorsJson) as Monitor[];
    const activeMonitor = monitors.find((m) => m.focused)?.name;

    if (!activeMonitor) {
      throw new Error("No active monitor found");
    }

    await $`grim -o "${activeMonitor}" ${SCREENSHOT_FILE}`;
    return true;
  } catch (error) {
    console.error("Error capturing active monitor:", error);
    return false;
  }
}

async function captureArea(geometry: string): Promise<boolean> {
  try {
    await $`grim -g "${geometry}" ${SCREENSHOT_FILE}`;
    return true;
  } catch (error) {
    console.error("Error capturing area:", error);
    return false;
  }
}

async function captureFrozenArea(geometry: string): Promise<boolean> {
  try {
    // Save current animations state
    const animationsJson = await $`hyprctl animations list -j`.text();
    const currentAnimations = JSON.parse(animationsJson);
    
    // Disable animations temporarily
    await $`hyprctl keyword animations:enabled 0`;
    
    // Force a frame to be rendered with animations disabled
    await $`hyprctl dispatch forcerendererreload`;
    await Bun.sleep(50); // Small delay to ensure frame is rendered
    
    // Take the screenshot
    await $`grim -g "${geometry}" ${SCREENSHOT_FILE}`;
    
    // Restore animations
    await $`hyprctl keyword animations:enabled 1`;
    
    return true;
  } catch (error) {
    console.error("Error capturing frozen area:", error);
    // Ensure animations are restored even if screenshot fails
    await $`hyprctl keyword animations:enabled 1`;
    return false;
  }
}

async function getGeometry(): Promise<string> {
  const proc = Bun.spawn([
    "slurp",
    "-d",
    "-b",
    "#00000044",
    "-c",
    "#00000000",
    "-s",
    "#00000000",
    "-w",
    "2",
  ]);

  const output = await new Response(proc.stdout).text();
  const geometry = output.trim();

  if (!geometry) {
    throw new Error("No area selected");
  }

  return geometry;
}

async function processWithSwappy(file: string): Promise<boolean> {
  return new Promise((resolve) => {
    Bun.spawn(["swappy", "-f", file, "-o", file], {
      async onExit(proc, exitCode, error) {
        if (exitCode === 0) {
          await Bun.sleep(100);

          await copyToClipboard(file);

          resolve(true);
        } else {
          console.error("Swappy failed:", error);
          resolve(false);
        }
      },
    });
  });
}

async function takeScreenshot(mode: string): Promise<boolean> {
  try {
    let success = false;

    switch (mode) {
      case "p":
        success = await captureFullScreen();
        break;

      case "m":
        success = await captureActiveMonitor();
        break;

      case "s":
        try {
          const geometry = await getGeometry();
          success = await captureArea(geometry);
        } catch (error) {
          console.error("Error during area selection:", error);
          return false;
        }
        break;
        // case "sf":
        // try {
        //   const geometry = await getGeometry();
        //   success = await captureFrozenArea(geometry);
        // } catch (error) {
        //   console.error("Error during frozen area selection:", error);
        //   return false;
        // }
        // break;

      default:
        console.log("Usage: screenshot.ts <mode>");
        console.log("Modes:");
        console.log(" p  : full screen");
        console.log(" s  : area selection");
        // console.log(" sf : frozen area selection");
        console.log(" m  : active monitor");
        return false;
    }

    if (success) {
      return (
        await sendNotification(
          SCREENSHOT_FILE,
          "Screenshot captured And Saved "
        ),
        processWithSwappy(SCREENSHOT_FILE),
        copyToClipboard(SCREENSHOT_FILE)
      );
    }

    return false;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error taking screenshot:", error.message);
    }
    return false;
  }
}

async function main() {
  const mode = Bun.argv[2];
  if (!mode) {
    console.log(`Usage: screenshot.ts <mode>

Modes:
  p   - Full screen
  s   - Area selection
  sf  - Frozen area selection (not working)
  m   - Active monitor`);
    
    process.exit(1);
  }


  const result =
    await $`hyprctl -j getoption cursor:no_hardware_cursors`.text();
  const hwCursor = (JSON.parse(result) as HyprctlResponse).int;

  try {
    await $`hyprctl keyword cursor:no_hardware_cursors false`;
    await Bun.sleep(100);

    await takeScreenshot(mode);
  } finally {
    await $`hyprctl keyword cursor:no_hardware_cursors ${hwCursor}`;
  }
}

main().catch((error) => {
  if (error instanceof Error) {
    console.error("Fatal error:", error.message);
  }
  process.exit(1);
});