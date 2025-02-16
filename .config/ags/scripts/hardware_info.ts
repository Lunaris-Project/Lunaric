#!/usr/bin/env bun

import { execSync } from 'child_process';

interface BatteryInfo {
  Battery_State: string;
  Warning_Level: string;
  Voltage: string;
  Charge_Cycles: string;
  Time_To_Empty: string;
  Kernel: string;
  Percentage: string;
  Capacity: string;
  Technology: string;
  Energy_Rate: string;
}

function getBatteryInfo(): string {
  try {
    // Check if upower is installed
    execSync('which upower >/dev/null 2>&1');
    
    // Get battery device path
    const batteryPath = execSync("upower -e | grep BAT").toString().trim();
    const batteryInfo = execSync(`upower -i ${batteryPath}`).toString();
    
    // Extract information using regex
    const getValue = (pattern: string): string => {
      const match = batteryInfo.match(new RegExp(`${pattern}:\\s+([\\w\\d\\.]+)`));
      return match ? match[1] : '';
    };

    const capacity = parseFloat(getValue('capacity').replace('%', '')).toFixed(2);
    const sysInfo = execSync('uname -r').toString().trim();

    const info: BatteryInfo = {
      Battery_State: getValue('state'),
      Warning_Level: getValue('warning-level'),
      Voltage: getValue('voltage'),
      Charge_Cycles: getValue('charge-cycles'),
      Time_To_Empty: getValue('time to empty'),
      Kernel: sysInfo,
      Percentage: getValue('percentage'),
      Capacity: capacity,
      Technology: getValue('technology'),
      Energy_Rate: getValue('energy-rate')
    };

    return JSON.stringify(info, null, 2);
  } catch (error) {
    console.error('Error: upower is not installed or insufficient permissions');
    return '{}';
  }
}

console.log(getBatteryInfo()); 