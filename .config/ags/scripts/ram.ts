#!/usr/bin/env bun

import { execSync } from 'child_process';

function getRamUsage(): string {
  try {
    execSync('which free >/dev/null 2>&1');
    
    const memInfo = execSync('free -m').toString();
    const memLine = memInfo.split('\n').find(line => line.startsWith('Mem:'));
    
    if (!memLine) {
      throw new Error('Could not find memory information');
    }

    const [, total, used] = memLine.trim().split(/\s+/);
    const usedPercentage = Math.round((parseInt(used) * 100) / parseInt(total));
    
    return usedPercentage.toString();
  } catch (error) {
    console.error('Error: free command is not available on this system');
    return '0';
  }
}

console.log(getRamUsage()); 