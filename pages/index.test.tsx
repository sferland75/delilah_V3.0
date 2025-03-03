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
            <a style={{ 
              padding: '0.5rem 1rem', 
              background: '#4299e1', 
              color: 'white',
              borderRadius: '0.25rem',
              textDecoration: 'none'
            }}>Dashboard</a>
          </Link>
          
          <Link href="/import-pdf">
            <a style={{ 
              padding: '0.5rem 1rem', 
              background: '#4299e1', 
              color: 'white',
              borderRadius: '0.25rem',
              textDecoration: 'none'
            }}>Import PDF</a>
          </Link>
          
          <Link href="/report-drafting">
            <a style={{ 
              padding: '0.5rem 1rem', 
              background: '#4299e1', 
              color: 'white',
              borderRadius: '0.25rem',
              textDecoration: 'none'
            }}>Reports</a>
          </Link>
          
          <Link href="/full-assessment">
            <a style={{ 
              padding: '0.5rem 1rem', 
              background: '#4299e1', 
              color: 'white',
              borderRadius: '0.25rem',
              textDecoration: 'none'
            }}>Full Assessment</a>
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
            <a style={{ 
              padding: '0.5rem 1rem', 
              background: '#e2e8f0', 
              color: '#1a202c',
              borderRadius: '0.25rem',
              textDecoration: 'none'
            }}>All Sections</a>
          </Link>
          
          <Link href="/medical-full">
            <a style={{ 
              padding: '0.5rem 1rem', 
              background: '#e2e8f0', 
              color: '#1a202c',
              borderRadius: '0.25rem',
              textDecoration: 'none'
            }}>Medical History</a>
          </Link>
          
          <Link href="/emergency-symptoms">
            <a style={{ 
              padding: '0.5rem 1rem', 
              background: '#e2e8f0', 
              color: '#1a202c',
              borderRadius: '0.25rem',
              textDecoration: 'none'
            }}>Symptoms</a>
          </Link>
        </div>
      </div>
    </div>
  );
}