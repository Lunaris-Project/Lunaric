#!/usr/bin/env bun

import { execSync } from 'child_process';
import { readFileSync } from 'fs';

interface SystemInfo {
  kernel_version: string;
  host_name: string;
  current_user: string;
  package_manager: string;
  installed_packages: number;
  uptime: string;
}

function getHostName(): string {
  try {
    return readFileSync('/etc/hostname', 'utf-8').trim();
  } catch {
    return 'unknown';
  }
}

function getPackageInfo(): { package_manager: string; installed_packages: number } {
  const packageManagers = [
    { cmd: 'dnf', count: 'dnf list installed | wc -l' },
    { cmd: 'yum', count: 'yum list installed | wc -l' },
    { cmd: 'apt', count: "dpkg-query -f '${binary:Package}\\n' -W | wc -l" },
    { cmd: 'pacman', count: 'pacman -Q | wc -l' },
    { cmd: 'zypper', count: 'zypper se --installed-only | wc -l' },
    { cmd: 'rpm', count: 'rpm -qa | wc -l' },
    { cmd: 'nix', count: 'nix-env -q | wc -l' }
  ];

  for (const pm of packageManagers) {
    try {
      execSync(`which ${pm.cmd} >/dev/null 2>&1`);
      const count = parseInt(execSync(pm.count).toString().trim());
      return {
        package_manager: pm.cmd,
        installed_packages: count
      };
    } catch {}
  }

  return {
    package_manager: 'unknown',
    installed_packages: 0
  };
}

function getUptime(): string {
  try {
    const uptimeRaw = execSync('uptime -p').toString().trim();
    const uptimeJson = JSON.parse(execSync(`echo '${uptimeRaw}' | jq -R -c '. | {"uptime": .}'`).toString());
    return uptimeJson.uptime;
  } catch (error) {
    return '';
  }
}

function getSystemInfo(): string {
  try {
    const { package_manager, installed_packages } = getPackageInfo();
    
    const info: SystemInfo = {
      kernel_version: execSync('uname -r').toString().trim(),
      host_name: getHostName(),
      current_user: execSync('id -un').toString().trim(),
      package_manager,
      installed_packages,
      uptime: getUptime()
    };

    return JSON.stringify(info, null, 2);
  } catch (error) {
    console.error('Error getting system information:', error);
    return '{}';
  }
}

console.log(getSystemInfo()); 