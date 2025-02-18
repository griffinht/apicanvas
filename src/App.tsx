import {
  ReactFlowProvider,
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  OnConnect,
  ReactFlowInstance,
  ConnectionLineType,
} from '@xyflow/react';

import { CustomEditor } from './editor/CustomEditor.tsx';
import { DragBar } from './dragbar/DragBar.tsx';
import { Schemas } from './tree/openapi/components/Schemas';
import { useSyncManager } from './tree/sync/SyncManager';

import '@xyflow/react/dist/style.css';

import { useState, useCallback, useEffect } from 'react';
import { initialNodes, nodeTypes } from './tree/nodes.ts';
import { edgeTypes, initialEdges } from './tree/index.ts';
import { ApiInfoBar } from './tree/Controls.tsx';
import { setPaths } from './Load';
import { getPaths } from './Save';

export default function App() {
  const [title, setTitle] = useState('My New API');
  const [version, setVersion] = useState('0.0.1');
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);
  const [direction, setDirection] = useState<'TB' | 'LR'>(() => 
    (localStorage.getItem('direction') as 'TB' | 'LR') || 'LR'
  );
  const [splitPosition, setSplitPosition] = useState(50);

  // Persist direction setting
  useEffect(() => {
    localStorage.setItem('direction', direction);
  }, [direction]);

  // Layout effect
  useEffect(() => {
    if (!rfInstance) {
      console.log('useEffect not firing: rfInstance is not set');
      return;
    }
    const { nodes: layoutedNodes, edges: layoutedEdges } = setPaths(getPaths(rfInstance), direction, rfInstance);
    setNodes([...layoutedNodes]);
    setEdges([...layoutedEdges]);
  }, [direction]);

  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((edges) => addEdge(connection, edges)),
    [setEdges]
  );

  const {
    autoSyncLeft,
    setAutoSyncLeft,
    autoSyncRight,
    setAutoSyncRight,
    syncError,
    handleEditorChange,
    saveToEditor,
    loadFromEditor
  } = useSyncManager(
    rfInstance,
    direction,
    nodes,
    edges,
    title,
    version,
    { setTitle, setVersion, setNodes, setEdges }
  );

  return (
    <ReactFlowProvider>
      <div style={{ display: 'flex', width: '100vw', height: '100vh' }}>        
        <div style={{ width: `${splitPosition}%`, height: '100%' }}>
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '4px', backgroundColor: '#6BA539', zIndex: 9999 }}></div>
          <div style={{ height: '99%', paddingTop: '0.5rem', overflow: 'auto' }}>
            <CustomEditor 
              onMount={(editor) => {
                (window as any).editor = editor;
              }}
              onChange={handleEditorChange}
            />
          </div>         
        </div>
        <DragBar
          onLoadFromEditor={loadFromEditor}
          onSaveToEditor={saveToEditor}
          splitPosition={splitPosition}
          onSplitPositionChange={setSplitPosition}
          autoSyncLeft={autoSyncLeft}
          autoSyncRight={autoSyncRight}
          onAutoSyncLeftChange={setAutoSyncLeft}
          onAutoSyncRightChange={setAutoSyncRight}
          flowInstance={rfInstance}
          syncError={syncError}
        />
        <div style={{ width: `${100 - splitPosition}%`, height: '95%' }}>
          <ApiInfoBar 
            title={title} 
            setTitle={setTitle} 
            version={version} 
            setVersion={setVersion}
            direction={direction}
            setDirection={setDirection}
          />
          <ReactFlow
            nodes={nodes}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            edges={edges}
            edgeTypes={edgeTypes}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setRfInstance}
            connectionLineType={ConnectionLineType.SmoothStep}
            fitView
          >
            <Background />
            <MiniMap />
            <Controls />
            {rfInstance && <Schemas rfInstance={rfInstance} />}
          </ReactFlow>
        </div>
        <div style={{ position: 'fixed', bottom: 0, left: 0, width: '100%', height: '4px', backgroundColor: '#6BA539', zIndex: 9999 }}></div>
      </div>
    </ReactFlowProvider>
  );
}
