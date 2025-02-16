#!/usr/bin/env bun

import { execSync } from 'child_process';

function getTemperatures(): string {
  try {
    execSync('which sensors >/dev/null 2>&1');
    
    const sensorOutput = execSync("sensors | grep 'Core\\|Sensor' | awk '{print $3}'").toString();
    
    return sensorOutput.trim();
  } catch (error) {
    console.error('Error: lm-sensors is not installed or insufficient permissions');
    return '';
  }
}

console.log(getTemperatures()); 