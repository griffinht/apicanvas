import {
  ReactFlowProvider,
  Background,
  Controls,
  MiniMap,
  Panel,
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  OnConnect,
  ReactFlowInstance,
  ConnectionLineType,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';

import { useState, useCallback, useEffect } from 'react';
import { LoadApiDialog} from './menu/LoadApiDialog';
import { showApiDialogSave as downloadApi } from './menu/SaveApiDialog';
import { showApiPreviewDialog } from './menu/PreviewDialog';
import { initialNodes, nodeTypes } from './nodes';
import { edgeTypes, initialEdges } from '.';
import { ApiInfoBar } from './ApiInfoBar';
import { getPaths } from './Save';
import { setPaths } from './Load';

export default function App() {
  const [title, setTitle] = useState('My New API');
  const [version, setVersion] = useState('0.0.1');
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);
  const [direction, setDirection] = useState<'TB' | 'LR'>('TB');

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

  const getApi = () => {
    if (!rfInstance) {
      throw new Error('rfInstance is not set');
    }
    return {
      openapi: "3.0.0",
      info: { title, version },
      paths: getPaths(rfInstance)
    };
  };


  // SHARE LINK DO THIS FIRST

  const setApi = (newApi: any) => {
    setTitle(newApi.info.title);
    setVersion(newApi.info.version);
    if (!rfInstance) {
      throw new Error('rfInstance is not set');
    }
    const { nodes, edges } = setPaths(newApi.paths, direction, rfInstance);
    setNodes(nodes);
    setEdges(edges);
  };

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
        onInit={setRfInstance}
        connectionLineType={ConnectionLineType.SmoothStep}
        fitView
      >
        <Background />
        <MiniMap />
        <Controls />
        <Panel position="top-left">
          <LoadApiDialog setApi={setApi} />
          <button onClick={() => downloadApi(getApi())}>save</button>
          <button onClick={() => showApiPreviewDialog(getApi())}>preview</button>
          <button onClick={() => setDirection('TB')}>vertical layout</button>
          <button onClick={() => setDirection('LR')}>horizontal layout</button>
          <button onClick={() => {
            const api = getApi();
            setApi({
              openapi: "bruh",
              info: { title: "bruh", version: "bruh" },
              paths: {
                "/bruh": {
                  get: {
                    summary: "bruh"
                  }
                }
              }
            });
            setTimeout(() => {
              setApi(api);
            }, 1000);
          }}>cycle (save then load)</button>
          <button onClick={() => { if (!rfInstance) throw new Error('rfInstance is not set'); console.log(getPaths(rfInstance))}}>get paths</button>
        </Panel>
      </ReactFlow>
    </ReactFlowProvider>
  );
}
