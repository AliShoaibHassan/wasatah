#!/usr/bin/env node

// Simple script to start only the web server
// This avoids the terminal loop issue when running both servers

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Web Server Only...');
console.log('📱 Web App: http://localhost:5173');
console.log('⚠️  Note: API server is not running. Use mock data only.');
console.log('');

// Start web server
const webProcess = spawn('npm', ['run', 'dev'], {
  cwd: path.join(__dirname, 'apps/web'),
  stdio: 'inherit',
  shell: true
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Stopping web server...');
  webProcess.kill('SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Stopping web server...');
  webProcess.kill('SIGTERM');
  process.exit(0);
});

webProcess.on('close', (code) => {
  console.log(`\n📊 Web server exited with code ${code}`);
  process.exit(code);
});
