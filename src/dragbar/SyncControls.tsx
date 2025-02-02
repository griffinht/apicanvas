interface SyncControlsProps {
  autoSyncLeft: boolean;
  autoSyncRight: boolean;
  onAutoSyncLeftChange: (value: boolean) => void;
  onAutoSyncRightChange: (value: boolean) => void;
  onSaveToEditor: () => void;
  onLoadFromEditor: () => void;
  syncError?: string | null;
}

export function SyncControls({
  autoSyncLeft,
  autoSyncRight,
  onAutoSyncLeftChange,
  onAutoSyncRightChange,
  onSaveToEditor,
  onLoadFromEditor,
  syncError
}: SyncControlsProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {syncError && (
        <button
          onClick={() => alert(syncError)}
          style={{
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            color: '#DC2626',
            fontSize: '16px',
            padding: '4px',
            margin: '4px 0'
          }}
        >
          ⚠️
        </button>
      )}
      
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
            if (e.target.checked && autoSyncRight) {
              alert('warning both auto sync directions are turned on. this might be buggy.');
            }
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
            if (e.target.checked && autoSyncLeft) {
              alert('Warning: Both auto-sync directions are now enabled. This may cause conflicts.');
            }
            onAutoSyncRightChange(e.target.checked);
          }}
        /> auto →
      </label>
    </div>
  );
}