#!/usr/bin/env node
/**
 * Dev setup: ensure .env.local exists (copy from .env.example if missing).
 * Run: npm run setup
 */

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const envLocal = path.join(root, '.env.local');
const envExample = path.join(root, '.env.example');

// Check Node version (18+)
const nodeMajor = parseInt(process.version.slice(1).split('.')[0], 10);
if (nodeMajor < 18) {
  console.error('PRBuild requires Node.js 18+. Current:', process.version);
  process.exit(1);
}

if (fs.existsSync(envLocal)) {
  console.log('.env.local found. Skipping setup.');
  process.exit(0);
}

if (!fs.existsSync(envExample)) {
  console.error('.env.example not found.');
  process.exit(1);
}

fs.copyFileSync(envExample, envLocal);
console.log('Created .env.local from .env.example.');
console.log('Edit .env.local with your Supabase, Stripe, and OpenAI keys (see DEV.md).');
process.exit(0);
