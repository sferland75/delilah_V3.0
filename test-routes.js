/**
 * Route Testing Script for Delilah V3.0
 * 
 * This script tests key routes in the application to ensure they are accessible.
 * It makes HTTP requests to each route and reports success or failure.
 */

const http = require('http');

const baseUrl = 'http://localhost:3000';
const routes = [
  '/',
  '/assessment',
  '/import-pdf',
  '/report-drafting',
  '/assessment-sections',
  '/full-assessment',
  '/medical-full',
  '/emergency-symptoms',
  '/typical-day'
];

console.log('Testing key routes in Delilah V3.0...');
console.log('Make sure the application is running on http://localhost:3000\n');

let successCount = 0;
let failureCount = 0;

function testRoute(route) {
  return new Promise((resolve) => {
    console.log(`Testing route: ${route}`);
    
    const url = `${baseUrl}${route}`;
    const req = http.get(url, (res) => {
      const { statusCode } = res;
      
      if (statusCode >= 200 && statusCode < 400) {
        console.log(`  ✓ Success (${statusCode})`);
        successCount++;
      } else {
        console.log(`  ✕ Failed with status code: ${statusCode}`);
        failureCount++;
      }
      
      resolve();
    });
    
    req.on('error', (error) => {
      console.log(`  ✕ Error: ${error.message}`);
      failureCount++;
      resolve();
    });
    
    req.end();
  });
}

async function runTests() {
  for (const route of routes) {
    await testRoute(route);
  }
  
  console.log('\nTest Results:');
  console.log(`  ✓ ${successCount} routes successful`);
  console.log(`  ✕ ${failureCount} routes failed`);
  
  if (failureCount === 0) {
    console.log('\nAll routes are working correctly!');
  } else {
    console.log('\nSome routes are failing. Check the logs above for details.');
  }
}

runTests();