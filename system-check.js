// Basic system check for Next.js development
const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

console.log('========= SYSTEM CHECK =========');
console.log(`Node.js version: ${process.version}`);
console.log(`Platform: ${os.platform()} ${os.release()}`);
console.log(`Architecture: ${os.arch()}`);
console.log(`CPU: ${os.cpus()[0].model} x ${os.cpus().length}`);
console.log(`Memory: ${Math.round(os.totalmem() / (1024 * 1024 * 1024))} GB`);
console.log(`Free memory: ${Math.round(os.freemem() / (1024 * 1024 * 1024))} GB`);
console.log(`User: ${os.userInfo().username}`);
console.log(`Temp directory: ${os.tmpdir()}`);

// Check if important Next.js files exist
const requiredFiles = [
  'package.json',
  'next.config.js',
  'src/pages/_app.js',
  'src/pages/index.tsx'
];

console.log('\n========= FILE CHECK =========');
requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  try {
    fs.accessSync(filePath, fs.constants.F_OK);
    console.log(`✅ ${file} - exists`);
  } catch (err) {
    console.log(`❌ ${file} - missing`);
  }
});

// Check network connectivity and port availability
console.log('\n========= NETWORK CHECK =========');

// Check if localhost is reachable
const checkLocalhost = () => {
  return new Promise((resolve) => {
    const req = http.get('http://127.0.0.1', () => {
      console.log('✅ localhost is reachable');
      resolve(true);
    });
    
    req.on('error', (err) => {
      if (err.code === 'ECONNREFUSED') {
        console.log('✅ localhost is responsive (connection refused, which is normal)');
        resolve(true);
      } else {
        console.log(`❌ localhost error: ${err.message}`);
        resolve(false);
      }
    });
    
    req.setTimeout(1000, () => {
      req.abort();
      console.log('❌ localhost connection timeout');
      resolve(false);
    });
  });
};

// Check if port 3000 is available
const checkPort3000 = () => {
  return new Promise((resolve) => {
    const server = http.createServer();
    
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.log('❌ Port 3000 is already in use');
      } else {
        console.log(`❌ Port check error: ${err.message}`);
      }
      resolve(false);
    });
    
    server.listen(3000, () => {
      console.log('✅ Port 3000 is available');
      server.close(() => resolve(true));
    });
  });
};

// Run the checks
const runChecks = async () => {
  await checkLocalhost();
  await checkPort3000();
  
  console.log('\n========= PACKAGE CHECK =========');
  try {
    const packageJson = require('./package.json');
    console.log(`Next.js version: ${packageJson.dependencies.next}`);
    console.log(`React version: ${packageJson.dependencies.react}`);
    console.log(`Dependencies: ${Object.keys(packageJson.dependencies).length}`);
    console.log(`Dev dependencies: ${Object.keys(packageJson.devDependencies || {}).length}`);
  } catch (err) {
    console.log(`❌ Error reading package.json: ${err.message}`);
  }
  
  console.log('\n========= RECOMMENDED ACTIONS =========');
  console.log('1. If port 3000 is in use, try using a different port: npm run dev -- -p 3001');
  console.log('2. Check browser developer tools for console errors');
  console.log('3. Try a different browser');
  console.log('4. Check if any firewall/antivirus is blocking local connections');
  console.log('5. Try clearing node_modules and reinstalling: rm -rf node_modules && npm install');
  console.log('6. Verify Node.js is at least v16+');
};

runChecks();
