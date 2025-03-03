import React from 'react';
import Link from 'next/link';

export default function SimpleNav() {
  return (
    <div style={{ 
      padding: '2rem', 
      maxWidth: '800px', 
      margin: '0 auto',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Delilah V3.0 - Reliable Navigation</h1>
      <p style={{ marginBottom: '2rem' }}>This is a reliable navigation page that uses minimal dependencies.</p>
      
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
          <a href="/assessment" style={{ 
            padding: '0.5rem 1rem', 
            background: '#4299e1', 
            color: 'white',
            borderRadius: '0.25rem',
            textDecoration: 'none'
          }}>Dashboard</a>
          
          <a href="/import-pdf" style={{ 
            padding: '0.5rem 1rem', 
            background: '#4299e1', 
            color: 'white',
            borderRadius: '0.25rem',
            textDecoration: 'none'
          }}>Import PDF</a>
          
          <a href="/report-drafting" style={{ 
            padding: '0.5rem 1rem', 
            background: '#4299e1', 
            color: 'white',
            borderRadius: '0.25rem',
            textDecoration: 'none'
          }}>Reports</a>
          
          <a href="/full-assessment" style={{ 
            padding: '0.5rem 1rem', 
            background: '#4299e1', 
            color: 'white',
            borderRadius: '0.25rem',
            textDecoration: 'none'
          }}>Full Assessment</a>
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
          <a href="/assessment-sections" style={{ 
            padding: '0.5rem 1rem', 
            background: '#e2e8f0', 
            color: '#1a202c',
            borderRadius: '0.25rem',
            textDecoration: 'none'
          }}>All Sections</a>
          
          <a href="/medical-full" style={{ 
            padding: '0.5rem 1rem', 
            background: '#e2e8f0', 
            color: '#1a202c',
            borderRadius: '0.25rem',
            textDecoration: 'none'
          }}>Medical History</a>
          
          <a href="/emergency-symptoms" style={{ 
            padding: '0.5rem 1rem', 
            background: '#e2e8f0', 
            color: '#1a202c',
            borderRadius: '0.25rem',
            textDecoration: 'none'
          }}>Symptoms</a>
          
          <a href="/typical-day" style={{ 
            padding: '0.5rem 1rem', 
            background: '#e2e8f0', 
            color: '#1a202c',
            borderRadius: '0.25rem',
            textDecoration: 'none'
          }}>Typical Day</a>
        </div>
      </div>
      
      <div style={{
        marginTop: '2rem',
        padding: '1rem',
        background: '#f7fafc',
        border: '1px solid #e2e8f0',
        borderRadius: '0.25rem'
      }}>
        <h3 style={{ marginTop: 0 }}>Troubleshooting</h3>
        <p>If a page doesn't load properly, try using the emergency navigation at:</p>
        <a href="/root.html" style={{ color: '#4299e1' }}>Emergency Navigation</a>
      </div>
    </div>
  );
}