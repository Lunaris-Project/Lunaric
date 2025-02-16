#!/usr/bin/env bun

import { execSync } from 'child_process';

function getCpuUsage(): string {
  try {
    const mpstatOutput = execSync('mpstat -P ALL 1 1').toString();
    const lastLine = mpstatOutput.split('\n').filter(line => line.trim()).pop() || '';
    const fields = lastLine.trim().split(/\s+/);
    const idlePercentage = parseFloat(fields[fields.length - 1]);
    const usagePercentage = (100 - idlePercentage).toFixed(2);
    return usagePercentage;
  } catch (error) {
    console.error('Error getting CPU usage:', error);
    return '0';
  }
}

// Get CPU usage and output
const cpuUsage = getCpuUsage();
console.log(cpuUsage);