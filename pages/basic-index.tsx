import React from 'react';
import Link from 'next/link';

export default function BasicIndex() {
  return (
    <div style={{
      maxWidth: '600px',
      margin: '40px auto',
      padding: '20px',
      backgroundColor: '#f0f0f0',
      border: '1px solid #ddd',
      borderRadius: '5px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{
        color: '#333',
        fontSize: '24px',
        marginBottom: '20px'
      }}>
        Basic Navigation
      </h1>
      
      <p style={{
        marginBottom: '20px',
        lineHeight: '1.5'
      }}>
        This is a basic page to test navigation. Click on the links below to test if routing is working properly:
      </p>
      
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}>
        <Link href="/test-page" style={{
          padding: '10px 15px',
          backgroundColor: '#0070f3',
          color: 'white',
          borderRadius: '5px',
          textDecoration: 'none',
          textAlign: 'center'
        }}>
          Go to Test Page
        </Link>
        
        <Link href="/medical-history" style={{
          padding: '10px 15px',
          backgroundColor: '#0070f3',
          color: 'white',
          borderRadius: '5px',
          textDecoration: 'none',
          textAlign: 'center'
        }}>
          Go to Medical History
        </Link>
        
        <Link href="/" style={{
          padding: '10px 15px',
          backgroundColor: '#0070f3',
          color: 'white',
          borderRadius: '5px',
          textDecoration: 'none',
          textAlign: 'center'
        }}>
          Go to Main Index
        </Link>
      </div>
    </div>
  );
}