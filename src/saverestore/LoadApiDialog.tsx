import { OpenAPISpec } from '../OpenAPISpec';
import { useState } from 'react';

export function LoadApiDialog({ setApi }: { setApi: (api: OpenAPISpec) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState('');

  const loadSample = async () => {
    try {
      const response = await fetch('/openapi.json');
      const sampleApi = await response.json();
      setApi(sampleApi);
    } catch (e) {
      alert('Error loading sample API: ' + e);
    }
  };

  const handleSubmit = () => {
    try {
      const api = JSON.parse(value);
      setApi(api);
      setIsOpen(false);
      setValue('');
    } catch (e) {
      alert('Error parsing JSON: ' + e);
    }
  };

  if (!isOpen) {
    return (
      <div>
        <button onClick={() => setIsOpen(true)}>Load API</button>
        <button onClick={loadSample}>Try Sample</button>
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        width: '80%',
        height: '80%'
      }}>
        <textarea 
          value={value}
          onChange={(e) => setValue(e.target.value)}
          style={{ 
            width: '100%',
            height: 'calc(100% - 40px)',
            fontFamily: 'monospace',
            resize: 'none'
          }}
        />
        <button onClick={handleSubmit}>Load</button>
        <button onClick={() => {
          setIsOpen(false);
          setValue('');
        }}>Cancel</button>
      </div>
    </div>
  );
} 