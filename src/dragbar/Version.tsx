import { version } from '../../package.json';

export function Version() {
  return (
    <div style={{
      fontSize: '10px',
      color: '#666',
      opacity: 0.7,
      fontFamily: 'monospace',
      userSelect: 'none',
      pointerEvents: 'auto',
      marginTop: '4px'
    }}>
      <a 
        href={`https://example.com`}
        style={{
          color: 'inherit',
          textDecoration: 'none'
        }}
        target="_blank"
        rel="noopener noreferrer"
      >
        v{version}
      </a>
    </div>
  );
} 