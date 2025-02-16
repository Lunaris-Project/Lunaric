#!/usr/bin/env bun

import { readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

function getWallpapers(folder: string): string {
  if (!folder) {
    console.error('Please provide the folder path as an argument.');
    process.exit(1);
  }

  try {
    const validExtensions = ['.jpg', '.png', '.jpeg', '.gif'];
    const files: string[] = [];

    function scanDirectory(dir: string) {
      const entries = readdirSync(dir);
      entries.forEach(entry => {
        const fullPath = join(dir, entry);
        if (statSync(fullPath).isDirectory()) {
          scanDirectory(fullPath);
        } else {
          const ext = extname(entry).toLowerCase();
          if (validExtensions.includes(ext)) {
            files.push(fullPath);
          }
        }
      });
    }

    scanDirectory(folder);
    return JSON.stringify(files, null, 2);
  } catch (error) {
    console.error('Error reading wallpapers folder:', error);
    return '[]';
  }
}

// Get folder path from command line arguments
const folder = process.argv[2];
console.log(getWallpapers(folder));