interface ErrorMessageProps {
  message: string | null;
  onDismiss?: () => void;
}

/**
 * A reusable error message component
 */
export function ShareErrorMessage({ message, onDismiss }: ErrorMessageProps) {
  if (!message) return null;
  
  return (
    <div style={{ 
      position: 'fixed',
      top: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: '#ffeeee',
      color: '#d32f2f',
      padding: '12px 20px',
      borderRadius: '4px',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
      zIndex: 9999,
      maxWidth: '90%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      <span>{message}</span>
      {onDismiss && (
        <button
          onClick={onDismiss}
          style={{
            background: 'none',
            border: 'none',
            color: '#d32f2f',
            marginLeft: '16px',
            cursor: 'pointer',
            fontSize: '16px',
            padding: '0 4px'
          }}
        >
          ✕
        </button>
      )}
    </div>
  );
} 