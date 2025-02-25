import React from 'react';

interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
}

/**
 * A reusable loading overlay component that displays a spinner and message
 */
export function ShareLoadingOverlay({ isLoading, message = 'Loading...' }: LoadingOverlayProps) {
  if (!isLoading) return null;
  
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999
    }}>
      <div style={{ 
        border: '6px solid #f3f3f3',
        borderTop: '6px solid #6BA539',
        borderRadius: '50%',
        width: '50px',
        height: '50px',
        animation: 'spin 2s linear infinite',
        marginBottom: '20px'
      }} />
      <p style={{ fontSize: '18px', fontWeight: 'bold' }}>{message}</p>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
} 