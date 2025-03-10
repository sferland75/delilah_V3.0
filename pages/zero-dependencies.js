// The most basic page possible with absolutely no dependencies
export default function ZeroDependencies() {
  if (typeof window !== 'undefined') {
    // This will only run on the client side
    console.log('ZeroDependencies page is running on client side');
    alert('ZeroDependencies page is running');
  }
  
  return (
    <html>
      <head>
        <title>Zero Dependencies</title>
      </head>
      <body>
        <h1>Zero Dependencies Page</h1>
        <p>This page has absolutely no dependencies or imports.</p>
        <p style={{color: 'red', fontWeight: 'bold'}}>
          If you can see this text, basic rendering is working.
        </p>
        <div style={{
          padding: '20px',
          backgroundColor: 'yellow',
          border: '5px solid black',
          margin: '20px 0'
        }}>
          <p style={{fontSize: '24px'}}>THIS IS A TEST BLOCK</p>
        </div>
      </body>
    </html>
  );
}