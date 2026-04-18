const { execSync } = require('child_process');

try {
  console.log('Starting Hardhat node...');
  execSync('npx hardhat node --host 0.0.0.0', {
    cwd: __dirname,
    stdio: 'inherit',
  });
} catch (error) {
  console.error('Failed to start Hardhat node:', error.message);
  process.exit(1);
}
