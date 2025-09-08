import { exec } from 'child_process';

export function openBrowser(url: string): void {
  const platform = process.platform;
  let command: string;
  
  if (platform === 'darwin') {
    command = `open "${url}"`;
  } else if (platform === 'win32') {
    command = `start "" "${url}"`;
  } else {
    command = `xdg-open "${url}"`;
  }
  
  exec(command, (error) => {
    if (error) {
      console.error('Failed to open browser:', error);
    } else {
      console.error(`Browser opened to ${url}`);
    }
  });
}
