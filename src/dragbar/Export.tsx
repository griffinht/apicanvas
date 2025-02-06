import { useState } from 'react';
import { ReactFlowInstance } from '@xyflow/react';  // Update this line
import { toPng, toSvg } from 'html-to-image';
import { Download as ExportIcon } from 'lucide-react';

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
        id='download'
        onClick={() => setShowDropdown(!showDropdown)}
      >
      <ExportIcon size={18} />
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