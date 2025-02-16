#!/usr/bin/env bun

import { readFileSync } from 'fs';

function getUptime(): string {
  try {
    const uptimeSeconds = parseFloat(readFileSync('/proc/uptime', 'utf-8').split(' ')[0]);
    const uptimeHours = Math.floor(uptimeSeconds / 3600);
    const uptimeDays = Math.floor(uptimeHours / 24);
    const remainderHours = uptimeHours % 24;

    if (uptimeDays > 0) {
      return `${uptimeDays} ي : ${remainderHours} س`;
    } else {
      return uptimeHours.toString();
    }
  } catch (error) {
    console.error('Error reading uptime:', error);
    return '0';
  }
}

console.log(getUptime()); 