import { useState } from 'react';
import { ReactFlowInstance } from '@xyflow/react';  // Update this line
import { toPng, toSvg } from 'html-to-image';

interface ExportProps {
  flowInstance: ReactFlowInstance | null;
}

export function Export({ flowInstance }: ExportProps) {
  const [showDropdown, setShowDropdown] = useState(false);

  const handleExport = async (format: string) => {
    console.log('Export clicked:', format);
    console.log('Flow instance:', flowInstance);

    if (!flowInstance) {
      console.log('No flow instance available');
      return;
    }

    try {
      // Get the flow element
      const flowElement = document.querySelector('.react-flow') as HTMLElement;
      console.log('Flow element:', flowElement);
      
      if (!flowElement) {
        console.log('Could not find .react-flow element');
        return;
      }

      // Generate filename
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      let dataUrl: string;

      switch (format) {
        case 'PNG':
          dataUrl = await toPng(flowElement, { backgroundColor: '#ffffff' });
          downloadImage(dataUrl, `flow-diagram-${timestamp}.png`);
          break;
        case 'SVG':
          dataUrl = await toSvg(flowElement, { backgroundColor: '#ffffff' });
          downloadImage(dataUrl, `flow-diagram-${timestamp}.svg`);
          break;
        case 'JSON':
          const flowData = flowInstance.toObject();
          downloadJson(flowData, `flow-data-${timestamp}.json`);
          break;
      }
    } catch (error) {
      console.error('Export failed:', error);
    }
    
    setShowDropdown(false);
  };

  const downloadImage = (dataUrl: string, filename: string) => {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    link.click();
  };

  const downloadJson = (data: any, filename: string) => {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        style={{
          padding: '8px 12px',
          margin: '4px 0',
          backgroundColor: 'transparent',
          border: '1px solid #ccc',
          borderRadius: '4px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        Export
      </button>
      
      {showDropdown && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: '0',
            backgroundColor: 'white',
            border: '1px solid #ccc',
            borderRadius: '4px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            zIndex: 1000
          }}
        >
          {['PNG', 'SVG'].map((format) => (
            <button
              key={format}
              onClick={() => handleExport(format)}
              style={{
                display: 'block',
                width: '100%',
                padding: '8px 12px',
                border: 'none',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                textAlign: 'left'
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.backgroundColor = '#f0f0f0';
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.backgroundColor = 'transparent';
              }}
            >
              {format}
            </button>
          ))}
          <a
            href="https://github.com/griffinht/oas2tree2/issues/14"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'block',
              width: '100%',
              padding: '8px 12px',
              border: 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              textAlign: 'left',
              textDecoration: 'none',
              color: 'inherit'
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.backgroundColor = '#f0f0f0';
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.backgroundColor = 'transparent';
            }}
          >
            export is kinda buggy, click to see github issue
          </a>
        </div>
      )}
    </div>
  );
}