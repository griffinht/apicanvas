import { useEffect, useState } from 'react';
import { ReactFlowInstance } from '@xyflow/react';
import { saveToEditor, loadFromEditor } from '../openapi/ApiManager';

const SAVE_DELAY = 1000; // 1 second in milliseconds

export function useSyncManager(
  rfInstance: ReactFlowInstance | null,
  direction: 'TB' | 'LR',
  nodes: any[],
  edges: any[],
  title: string,
  version: string,
  callbacks: {
    setTitle: (title: string) => void;
    setVersion: (version: string) => void;
    setNodes: (nodes: any) => void;
    setEdges: (edges: any) => void;
  }
) {
  const [lastSaveTime, setLastSaveTime] = useState(0);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [autoSyncLeft, setAutoSyncLeft] = useState(() => 
    localStorage.getItem('autoSyncLeft') === 'true'
  );
  const [autoSyncRight, setAutoSyncRight] = useState(() => 
    localStorage.getItem('autoSyncRight') === 'true'
  );

  // Persist sync settings
  useEffect(() => {
    localStorage.setItem('autoSyncLeft', autoSyncLeft.toString());
  }, [autoSyncLeft]);

  useEffect(() => {
    localStorage.setItem('autoSyncRight', autoSyncRight.toString());
  }, [autoSyncRight]);

  // Auto-sync left (graph to editor)
  useEffect(() => {
    if (!autoSyncLeft || !rfInstance) return;
    
    const now = Date.now();
    if (now - lastSaveTime < SAVE_DELAY) return;
    
    saveToEditor(rfInstance, { title, version });
    setLastSaveTime(now);
    console.log('autoload right to graph from editor')
  }, [nodes, edges, title, version, rfInstance, autoSyncLeft, lastSaveTime]);

  // Handle editor changes
  const handleEditorChange = (value: string | undefined) => {
    if (!value || !autoSyncRight || !rfInstance) return;
    
    const now = Date.now();
    if (now - lastSaveTime < SAVE_DELAY) return;
    
    try {
      loadFromEditor(rfInstance, direction, callbacks);
      setLastSaveTime(now);
      setSyncError(null);
    } catch (error) {
      setSyncError(error + "");
      console.error('Error parsing JSON:', error);
    }
  };

  return {
    autoSyncLeft,
    setAutoSyncLeft,
    autoSyncRight,
    setAutoSyncRight,
    syncError,
    handleEditorChange,
    saveToEditor: () => rfInstance && saveToEditor(rfInstance, { title, version }),
    loadFromEditor: () => rfInstance && loadFromEditor(rfInstance, direction, callbacks)
  };
} 