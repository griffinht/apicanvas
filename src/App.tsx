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
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';

import { useState, useCallback } from 'react';
import { LoadApiDialog} from './saverestore/LoadApiDialog';
import { showApiDialogSave as downloadApi } from './saverestore/SaveApiDialog';
import { showApiPreviewDialog } from './saverestore/PreviewDialog';
import { initialNodes, nodeTypes } from './nodes';
import { edgeTypes, initialEdges } from './edges';

export default function App() {
  const [title, setTitle] = useState('My New API');
  const [version, setVersion] = useState('0.0.1');
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [rfInstance, setRfInstance] = useState(null);

  const getPaths = () => {
    console.log(rfInstance.toObject());
    // nodes and edges
    return {};
  };

  const setPaths = (paths: any) => {
    console.log(paths);
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

  return (
    <ReactFlowProvider>
      <div className="api-info">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value || 'Untitled API')}
          style={{ fontSize: 'inherit', fontWeight: 'bold' }}
        />
        {' - v'}
        <input
          type="text"
          value={version}
          onChange={(e) => setVersion(e.target.value || '0.0.1')}
          style={{ fontSize: 'inherit', width: '60px' }}
        />
      </div>
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
