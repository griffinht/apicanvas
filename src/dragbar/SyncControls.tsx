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
   <label className="checkbox-container tooltip" data-tooltip="Enable auto-sync from diagram to editor">
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
        /> 
  </label>

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
        
      </label>
      <button
      id="sync-button"
      className="tooltip"
      data-tooltip="Manually sync the diagram to the editor"
      onClick={(e) => {
        e.stopPropagation();
        onSaveToEditor();
      }}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="15 18 9 12 15 6"></polyline>
      </svg>
      </button>

  <button
    id="sync-button"
    className="tooltip"
    data-tooltip="Manually sync the diagram to the editor"
    onClick={(e) => {
      e.stopPropagation();
      onLoadFromEditor();
    }}
  >
    <svg
      width="24" 
      height="24" 
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="8 19 16 12 8 5"></polyline> 
    </svg>
  </button>

  <label className="checkbox-container tooltip" data-tooltip="Enable auto-sync from editor to diagram">
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
    />
  </label>
    </div>
  );
}