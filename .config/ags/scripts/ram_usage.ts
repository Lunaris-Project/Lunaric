#!/usr/bin/env bun

import { execSync } from 'child_process';

interface ProcessInfo {
  pid: string;
  process: string;
  '%': string;
  user: string;
  command: string;
}

function getRamProcesses(): string {
  try {
    const user = execSync('echo $USER').toString().trim();
    const psOutput = execSync(
      "ps -eo pid,%mem,comm --sort=-%mem | head -n 7 | tail -n +2"
    ).toString();

    const processes: ProcessInfo[] = psOutput
      .trim()
      .split('\n')
      .map(line => {
        const parts = line.trim().split(/\s+/);
        if (parts.length < 3) return null;

        const [pid, mem, ...commandParts] = parts;
        const command = commandParts.join(' ');

        return {
          pid,
          process: command,
          '%': mem,
          user,
          command
        };
      })
      .filter((p): p is ProcessInfo => p !== null);

    return JSON.stringify(processes, null, 2);
  } catch (error) {
    console.error('Error getting RAM process information:', error);
    return '[]';
  }
}

console.log(getRamProcesses()); 