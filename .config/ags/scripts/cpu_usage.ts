#!/usr/bin/env bun

import { execSync } from 'child_process';

interface ProcessInfo {
  pid: string;
  process: string;
  '%': string;
}

function getTopProcesses(): ProcessInfo[] {
  try {
    const numCores = parseInt(execSync('nproc').toString());

    const psOutput = execSync(
      "ps -eo pid,%cpu,comm --sort=-%cpu | awk 'NR>1' | head -n 6"
    ).toString();

    const processes = psOutput
      .trim()
      .split('\n')
      .map(line => {
        const parts = line.trim().split(/\s+/);
        if (parts.length < 3) return null;

        const pid = parts[0];
        const cpu = parts[1];
        const command = parts.slice(2).join(' ');
        
        const normalizedCpu = (parseFloat(cpu) / numCores).toFixed(2);

        return {
          pid,
          process: command,
          '%': normalizedCpu
        };
      })
      .filter((p): p is ProcessInfo => p !== null);

    return processes;
  } catch (error) {
    console.error('Error getting process information:', error);
    return [];
  }
}

// Get process information and output as JSON
const processes = getTopProcesses();
console.log(JSON.stringify(processes, null, 2));