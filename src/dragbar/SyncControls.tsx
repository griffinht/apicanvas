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
      <label className="checkbox-container tooltip" data-tooltip="Enable auto-sync from diagram to editor">
        <input
          type="checkbox"
          checked={autoSyncLeft}
          onChange={(e) => {
            e.stopPropagation();
            onAutoSyncLeftChange(e.target.checked);
          }}
        /> 
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
      <polyline points="8 19 16 12 8 5"></polyline> 
    </svg>
  </button>

  <label className="checkbox-container tooltip" data-tooltip="Enable auto-sync from editor to diagram">
    <input
      type="checkbox"
      checked={autoSyncRight}
      onChange={(e) => {
        e.stopPropagation();
        onAutoSyncRightChange(e.target.checked);
      }}
    />
  </label>
    </div>
  );
} 