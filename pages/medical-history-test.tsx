import React from 'react';
import Head from 'next/head';
import UltraBasic from '../components/medical-history/UltraBasic';

// Simple component defined directly in this file
const InlineComponent = () => {
  alert('InlineComponent is executing - confirm in the alert');
  
  return (
    <div style={{
      border: '4px solid blue',
      padding: '20px',
      margin: '20px',
      backgroundColor: 'lightgreen'
    }}>
      <h1 style={{color: 'blue', fontSize: '24px'}}>INLINE COMPONENT</h1>
      <p style={{color: 'red'}}>This component is defined directly inside the page file.</p>
    </div>
  );
};

export default function MedicalHistoryPage() {
  alert('MedicalHistoryPage is executing - confirm in the alert');
  
  return (
    <>
      <Head>
        <title>Medical History | Delilah V3.0</title>
      </Head>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '20px'
      }}>
        <h1 style={{
          fontSize: '32px',
          fontWeight: 'bold',
          marginBottom: '20px'
        }}>
          Medical History Diagnostic Page
        </h1>
        
        <div style={{
          border: '4px solid black',
          padding: '20px',
          margin: '20px',
          backgroundColor: 'lightgray'
        }}>
          <h2 style={{color: 'black', fontSize: '20px'}}>THIS TEXT IS DIRECTLY IN THE PAGE</h2>
          <p>If you can see this, the page itself is rendering correctly.</p>
        </div>
        
        <InlineComponent />
        
        <UltraBasic />
      </div>
    </>
  );
}