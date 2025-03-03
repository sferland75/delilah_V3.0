import React from 'react';
import Link from 'next/link';

export default function SimpleFallbackHome() {
  return (
    <div style={{ 
      padding: '2rem', 
      maxWidth: '800px', 
      margin: '0 auto',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Delilah V3.0 - Simple Nav</h1>
      <p style={{ marginBottom: '2rem' }}>This is a simple navigation page without any UI component dependencies.</p>
      
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <h2>Main Navigation</h2>
        <div style={{ 
          display: 'flex', 
          gap: '1rem',
          flexWrap: 'wrap' 
        }}>
          <Link href="/assessment">
            <div style={{ 
              padding: '0.5rem 1rem', 
              background: '#4299e1', 
              color: 'white',
              borderRadius: '0.25rem',
              textDecoration: 'none',
              cursor: 'pointer'
            }}>Dashboard</div>
          </Link>
          
          <Link href="/import-pdf">
            <div style={{ 
              padding: '0.5rem 1rem', 
              background: '#4299e1', 
              color: 'white',
              borderRadius: '0.25rem',
              textDecoration: 'none',
              cursor: 'pointer'
            }}>Import PDF</div>
          </Link>
          
          <Link href="/report-drafting">
            <div style={{ 
              padding: '0.5rem 1rem', 
              background: '#4299e1', 
              color: 'white',
              borderRadius: '0.25rem',
              textDecoration: 'none',
              cursor: 'pointer'
            }}>Reports</div>
          </Link>
          
          <Link href="/full-assessment">
            <div style={{ 
              padding: '0.5rem 1rem', 
              background: '#4299e1', 
              color: 'white',
              borderRadius: '0.25rem',
              textDecoration: 'none',
              cursor: 'pointer'
            }}>Full Assessment</div>
          </Link>
        </div>
      </div>
      
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '1rem' 
      }}>
        <h2>Assessment Sections</h2>
        <div style={{ 
          display: 'flex', 
          gap: '1rem',
          flexWrap: 'wrap'
        }}>
          <Link href="/assessment-sections">
            <div style={{ 
              padding: '0.5rem 1rem', 
              background: '#e2e8f0', 
              color: '#1a202c',
              borderRadius: '0.25rem',
              textDecoration: 'none',
              cursor: 'pointer'
            }}>All Sections</div>
          </Link>
          
          <Link href="/medical-full">
            <div style={{ 
              padding: '0.5rem 1rem', 
              background: '#e2e8f0', 
              color: '#1a202c',
              borderRadius: '0.25rem',
              textDecoration: 'none',
              cursor: 'pointer'
            }}>Medical History</div>
          </Link>
          
          <Link href="/emergency-symptoms">
            <div style={{ 
              padding: '0.5rem 1rem', 
              background: '#e2e8f0', 
              color: '#1a202c',
              borderRadius: '0.25rem',
              textDecoration: 'none',
              cursor: 'pointer'
            }}>Symptoms</div>
          </Link>
        </div>
      </div>
    </div>
  );
}