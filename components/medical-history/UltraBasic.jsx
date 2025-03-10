import React from 'react';

export function UltraBasic() {
  alert('UltraBasic component is executing - confirm in the alert');
  
  return (
    <div style={{
      border: '4px solid red',
      padding: '20px',
      margin: '20px',
      backgroundColor: 'lightyellow'
    }}>
      <h1 style={{color: 'red', fontSize: '24px'}}>ULTRA BASIC COMPONENT</h1>
      <p style={{color: 'blue'}}>This is a test component with inline styling and no dependencies.</p>
      <button 
        style={{
          backgroundColor: 'green',
          color: 'white',
          padding: '10px',
          borderRadius: '5px',
          border: 'none',
          cursor: 'pointer',
          marginTop: '10px'
        }}
        onClick={() => alert('Button clicked!')}
      >
        Click Me
      </button>
    </div>
  );
}

export default UltraBasic;