#!/usr/bin/env bun

import { execSync } from 'child_process';

// Get the CPU usage percentage for each core using 'mpstat'
function getCpuUsages(): number[] {
  try {
    const mpstatOutput = execSync('mpstat -P ALL 1 1').toString();
    const usages = mpstatOutput
      .split('\n')
      .filter(line => line.includes('Average:') && !line.includes('all'))
      .map(line => {
        const fields = line.trim().split(/\s+/);
        return 100 - parseFloat(fields[fields.length - 1]);
      });
    
    return usages;
  } catch (error) {
    console.error('Error getting CPU usage:', error);
    return [];
  }
}

// Get CPU usages and format as JSON array
const cpuUsages = getCpuUsages();
console.log(JSON.stringify(cpuUsages));