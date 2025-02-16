#!/usr/bin/env bun

import { execSync } from 'child_process';

function getTextDirection(): string {
  try {
    const locale = execSync('locale').toString();
    const lang = locale.match(/LANG=(\w+)/)?.[1] || '';
    
    return lang.includes('ar') ? 'RTL' : 'LTR';
  } catch (error) {
    console.error('Error detecting language:', error);
    return 'LTR'; // Default to LTR if there's an error
  }
}

console.log(getTextDirection());