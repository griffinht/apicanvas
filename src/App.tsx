import {
  ReactFlowProvider,
  Background,
  Controls,
  MiniMap,
  Panel,
  ReactFlow,
  useNodesState,
  useEdgesState,
  useReactFlow,
  addEdge,
  OnConnect,
  ReactFlowInstance,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';

import { useState, useCallback, useEffect } from 'react';
import { LoadApiDialog} from './saverestore/LoadApiDialog';
import { showApiDialogSave as downloadApi } from './saverestore/SaveApiDialog';
import { showApiPreviewDialog } from './saverestore/PreviewDialog';
import { initialNodes, nodeTypes } from './nodes';
import { edgeTypes, initialEdges } from './edges';
import { ApiInfoBar } from './ApiInfoBar';
import { AppNode } from './misc/nodes/types';

export default function App() {
  const [title, setTitle] = useState('My New API');
  const [version, setVersion] = useState('0.0.1');
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);

  const getPaths = () => {
    if (!rfInstance) return {};
    const flowData = rfInstance.toObject();
    // nodes and edges
    return {};
  };

  const setPaths = (paths: any) => {
    // Clear existing nodes
    setNodes([{
      id: 'root',
      type: 'default',
      position: { x: 0, y: 0 },
      data: { 
        label: (
          <div>
            <div>/</div>
            <button 
              style={{ marginTop: '8px' }}
              onClick={() => {
                const newNode = {
                  id: `endpoint-${Date.now()}`,
                  type: 'default',
                  position: { x: 0, y: 100 },
                  data: { 
                    label: 'GET /new-path'
                  }
                };
                setNodes((nds) => [...nds, newNode]);
              }}
            >
              + Add Endpoint
            </button>
          </div>
        )
      }
    }]);
    // Clear existing edges
    setEdges([]);
  };

  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((edges) => addEdge(connection, edges)),
    [setEdges]
  );

  const getApi = () => {
    return {
      openapi: "3.0.0",
      info: { title, version },
      paths: getPaths()
    };
  };

  const setApi = (newApi: any) => {
    setTitle(newApi.info.title);
    setVersion(newApi.info.version);
    setPaths(newApi.paths);
  };

  useEffect(() => {
    //initializeApp(setApi);
  }, []);

  return (
    <ReactFlowProvider>
      <ApiInfoBar title={title} setTitle={setTitle} version={version} setVersion={setVersion} />
      <ReactFlow
        nodes={nodes}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        edges={edges}
        edgeTypes={edgeTypes}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        //@ts-ignore
        onInit={setRfInstance}
        fitView
      >
        <Background />
        <MiniMap />
        <Controls />
        <Panel position="top-left">
          <LoadApiDialog setApi={setApi} />
          <button onClick={() => downloadApi(getApi())}>save</button>
          <button onClick={() => showApiPreviewDialog(getApi())}>preview</button>
        </Panel>
      </ReactFlow>
    </ReactFlowProvider>
  );
}
