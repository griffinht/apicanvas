interface DragBarProps {
  onLoadFromEditor: () => void;
  onSaveToEditor: () => void;
  splitPosition: number;
  onSplitPositionChange: (newPosition: number) => void;
  autoSyncLeft: boolean;
  autoSyncRight: boolean;
  onAutoSyncLeftChange: (value: boolean) => void;
  onAutoSyncRightChange: (value: boolean) => void;
}

export function DragBar({ 
  onLoadFromEditor, 
  onSaveToEditor, 
  splitPosition,
  onSplitPositionChange,
  autoSyncLeft,
  autoSyncRight,
  onAutoSyncLeftChange,
  onAutoSyncRightChange
}: DragBarProps) {
  const handleMouseDown = (e: React.MouseEvent) => {
    const handleMouseMove = (e: MouseEvent) => {
      const windowWidth = window.innerWidth;
      const newPosition = (e.clientX / windowWidth) * 100;
      onSplitPositionChange(Math.min(Math.max(newPosition, 20), 80)); // Limit between 20% and 80%
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
      
      {/* Sync controls */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <label style={{ 
          display: 'flex', 
          alignItems: 'center', 
          fontSize: '12px',
          margin: '4px 0'
        }}>
          <input
            type="checkbox"
            checked={autoSyncLeft}
            onChange={(e) => {
              e.stopPropagation();
              onAutoSyncLeftChange(e.target.checked);
            }}
          /> auto ←
        </label>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSaveToEditor();
          }}
          style={{ margin: '4px 0', width: '50px' }}
        >
          sync ←
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onLoadFromEditor();
          }}
          style={{ margin: '4px 0', width: '50px' }}
        >
          sync →
        </button>
        <label style={{ 
          display: 'flex', 
          alignItems: 'center', 
          fontSize: '12px',
          margin: '4px 0'
        }}>
          <input
            type="checkbox"
            checked={autoSyncRight}
            onChange={(e) => {
              e.stopPropagation();
              onAutoSyncRightChange(e.target.checked);
            }}
          /> auto →
        </label>
      </div>

      <div style={{ flex: 1 }} /> {/* Spacer */}

      {/* Save/Load/Try buttons at bottom */}
      <div style={{ 
        marginBottom: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            alert('hi');
          }}
          style={{ margin: '12px 0', width: '50px' }}
        >
          save
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            alert('hi');
          }}
          style={{ margin: '12px 0', width: '50px' }}
        >
          load
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            alert('hi');
          }}
          style={{ margin: '12px 0', width: '50px' }}
        >
          try
        </button>
      </div>
    </div>
  );
} 