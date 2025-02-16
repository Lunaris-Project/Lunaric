#!/usr/bin/env bun

import { execSync } from 'child_process';

interface SensorData {
  wifi: string;
  nvme_total: string;
  nvme_sensor1: string;
  nvme_sensor2: string;
  cpu_total: string;
  cpu_core0: string;
  cpu_core1: string;
  cpu_core2: string;
  cpu_core3: string;
  cpu_core4: string;
  cpu_core5: string;
}

function getSensorTemp(label: string, sensorData: string): string {
  try {
    const lines = sensorData.split('\n');
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes(label) && !lines[i].includes('pch_cannonlake-virtual-0')) {
        const nextLine = lines[i + 1];
        if (nextLine) {
          const value = nextLine.trim().split(/\s+/)[1];
          return value ? value.replace('+', '') : '';
        }
      }
    }
    return '';
  } catch (error) {
    return '';
  }
}

function formatTemp(temp: string): string {
  return temp ? temp.includes('.') ? temp : `${temp}.000` : '';
}

function getDeviceTemps(): string {
  try {
    const sensorData = execSync('sensors -u').toString();
    
    const temps: SensorData = {
      wifi: formatTemp(getSensorTemp('temp1', sensorData)),
      nvme_total: formatTemp(getSensorTemp('Composite', sensorData)),
      nvme_sensor1: formatTemp(getSensorTemp('Sensor 1:', sensorData)),
      nvme_sensor2: formatTemp(getSensorTemp('Sensor 2:', sensorData)),
      cpu_total: formatTemp(getSensorTemp('Package id 0:', sensorData)),
      cpu_core0: formatTemp(getSensorTemp('Core 0:', sensorData)),
      cpu_core1: formatTemp(getSensorTemp('Core 1:', sensorData)),
      cpu_core2: formatTemp(getSensorTemp('Core 2:', sensorData)),
      cpu_core3: formatTemp(getSensorTemp('Core 3:', sensorData)),
      cpu_core4: formatTemp(getSensorTemp('Core 4:', sensorData)),
      cpu_core5: formatTemp(getSensorTemp('Core 5:', sensorData))
    };

    const output = [
      '{',
      `  "wifi": ${temps.wifi},`,
      `  "nvme_total": ${temps.nvme_total},`,
      `  "nvme_sensor1": ${temps.nvme_sensor1},`,
      `  "nvme_sensor2": ${temps.nvme_sensor2},`,
      `  "cpu_total": ${temps.cpu_total},`,
      `  "cpu_core0": ${temps.cpu_core0},`,
      `  "cpu_core1": ${temps.cpu_core1},`,
      `  "cpu_core2": ${temps.cpu_core2},`,
      `  "cpu_core3": ${temps.cpu_core3},`,
      `  "cpu_core4": ${temps.cpu_core4},`,
      `  "cpu_core5": ${temps.cpu_core5}`,
      '}'
    ].join('\n');

    return output;
  } catch (error) {
    console.error('Error getting device temperatures:', error);
    return '{}';
  }
}

console.log(getDeviceTemps());