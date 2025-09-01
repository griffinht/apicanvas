import { Save } from './Save.tsx';
import { Load } from './Load.tsx';
import { Export } from './Export.tsx';
import { Share } from './Share.tsx';
import { SyncControls } from './SyncControls';
import { TrySample } from './TrySample';
import { Version } from './Version';
import { NewProject } from './New.tsx';

import { ReactFlowInstance } from '@xyflow/react';

interface DragBarProps {
  onLoadFromEditor: () => void;
  onSaveToEditor: () => void;
  splitPosition: number;
  onSplitPositionChange: (newPosition: number) => void;
  autoSyncLeft: boolean;
  autoSyncRight: boolean;
  onAutoSyncLeftChange: (value: boolean) => void;
  onAutoSyncRightChange: (value: boolean) => void;
  flowInstance: ReactFlowInstance | null;  // Add this line
  syncError?: string | null;
}

export function DragBar({
  onLoadFromEditor, 
  onSaveToEditor, 
  onSplitPositionChange,
  autoSyncLeft,
  autoSyncRight,
  onAutoSyncLeftChange,
  onAutoSyncRightChange,
  flowInstance,
  syncError,
}: DragBarProps) {
  const handleMouseDown = (event: React.MouseEvent) => {
    event.preventDefault();
    
    const handleMouseMove = (e: MouseEvent) => {
      const windowWidth = window.innerWidth;
      const newPosition = (e.clientX / windowWidth) * 100;
      onSplitPositionChange(Math.min(Math.max(newPosition, 20), 80));
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div
      style={{
        width: '100px',
        background: '#f0f0f0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        cursor: 'ew-resize',
        userSelect: 'none',
        padding: '10px 0',
        borderLeft: '1px solid #ccc',
        borderRight: '1px solid #ccc',
        height: '100%',
      }}
      onMouseDown={handleMouseDown}
    >
      <div style={{ flex: 1 }} /> {/* Spacer */}
      
      <SyncControls
        autoSyncLeft={autoSyncLeft}
        autoSyncRight={autoSyncRight}
        onAutoSyncLeftChange={onAutoSyncLeftChange}
        onAutoSyncRightChange={onAutoSyncRightChange}
        onSaveToEditor={onSaveToEditor}
        onLoadFromEditor={onLoadFromEditor}
        syncError={syncError}  // Add this line
      />

      <div style={{ flex: 1 }} /> {/* Spacer */}

      {/* Save/Load/Try buttons at bottom */}
      <div style={{ 
        marginBottom: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <NewProject />
        <div style={{ display: 'flex', gap: '5px' }}>
          <Save />
          <Export flowInstance={flowInstance} />
        </div>
        <div style={{ display: 'flex', gap: '5px', marginTop: '10px' }}>
          <Load />
          <Share />
        </div>
        <TrySample />
      </div>

      {/* Links section */}
      <div style={{
        marginBottom: '10px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        fontSize: '12px'
      }}>
        <a
          href="https://github.com/griffinht/oas2tree2"
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          style={{ 
            color: '#666',
            textDecoration: 'none',
            margin: '4px 0',
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
            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          analytics
        </a>
        <a
          href="https://github.com/griffinht/oas2tree2"
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          style={{ 
            color: '#666',
            textDecoration: 'none',
            margin: '4px 0',
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
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
          </svg>
          source code
        </a>
        <Version />
      </div>
    </div>
  );
}
