export default function TestRoute() {
  return (
    <div style={{ padding: "40px", maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "24px", marginBottom: "20px" }}>Test Route</h1>
      <p>This is a test page to verify routing is working correctly.</p>
      <div style={{ marginTop: "20px", padding: "20px", border: "1px solid #ddd" }}>
        <p>Current time: {new Date().toLocaleTimeString()}</p>
      </div>
    </div>
  );
}
