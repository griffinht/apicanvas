interface SyncControlsProps {
  autoSyncLeft: boolean;
  autoSyncRight: boolean;
  onAutoSyncLeftChange: (value: boolean) => void;
  onAutoSyncRightChange: (value: boolean) => void;
  onSaveToEditor: () => void;
  onLoadFromEditor: () => void;
}

export function SyncControls({
  autoSyncLeft,
  autoSyncRight,
  onAutoSyncLeftChange,
  onAutoSyncRightChange,
  onSaveToEditor,
  onLoadFromEditor
}: SyncControlsProps) {
  return (
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
        /> ← auto
      </label>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onSaveToEditor();
        }}
        style={{ margin: '4px 0', width: '70px' }}
      >
        ← sync
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onLoadFromEditor();
        }}
        style={{ margin: '4px 0', width: '70px' }}
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
  );
} 