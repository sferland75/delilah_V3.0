// Simple script to debug redirection issues in Next.js
const http = require('http');
const fs = require('fs');

// Create a simple server to check if non-Next.js routing works
const server = http.createServer((req, res) => {
  console.log(`Request received: ${req.method} ${req.url}`);
  
  res.setHeader('Content-Type', 'text/html');
  res.writeHead(200);
  res.end(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Debug Server</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
          pre { background: #f4f4f4; padding: 10px; border-radius: 5px; }
        </style>
      </head>
      <body>
        <h1>Delilah V3.0 Debug Page</h1>
        <p>This simple server is working correctly, which means:</p>
        <ul>
          <li>Your network connection is functioning properly</li>
          <li>Port 3001 is available and accessible</li>
          <li>HTTP requests can be served without redirection</li>
        </ul>
        <h2>Request Details:</h2>
        <pre>
Method: ${req.method}
URL: ${req.url}
Headers: ${JSON.stringify(req.headers, null, 2)}
        </pre>
        <p>If you're seeing this page, the issue is specific to Next.js routing or middleware, not a general network problem.</p>
      </body>
    </html>
  `);
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Debug server running at http://localhost:${PORT}`);
  console.log('Try accessing this URL in your browser to test basic HTTP connectivity');
  console.log('Press Ctrl+C to stop the server');
});
