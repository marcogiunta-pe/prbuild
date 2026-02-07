#!/usr/bin/env node
/**
 * Dev server script that finds an available port and starts Next.js.
 * Fixes connection issues from port conflicts.
 */

const { spawn } = require('child_process');
const net = require('net');

function isPortFree(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once('error', () => resolve(false));
    server.once('listening', () => {
      server.close();
      resolve(true);
    });
    server.listen(port, '127.0.0.1');
  });
}

async function findPort(start = 24678) {
  for (let port = start; port < start + 100; port++) {
    if (await isPortFree(port)) return port;
  }
  throw new Error('Could not find available port');
}

async function main() {
  const port = await findPort();
  console.log('\n🚀 Starting dev server on port', port);
  console.log('   Open: http://127.0.0.1:' + port);
  console.log('   Or:   http://localhost:' + port);
  console.log('');

  const child = spawn('npx', ['next', 'dev', '-p', String(port), '-H', '127.0.0.1'], {
    stdio: 'inherit',
    env: { ...process.env, PORT: String(port) },
    cwd: require('path').resolve(__dirname, '..'),
  });

  child.on('exit', (code) => process.exit(code ?? 0));
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
