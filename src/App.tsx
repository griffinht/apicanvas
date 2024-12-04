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
import { LoadApiDialog} from './menu/LoadApiDialog';
import { showApiDialogSave as downloadApi } from './menu/SaveApiDialog';
import { showApiPreviewDialog } from './menu/PreviewDialog';
import { initialNodes, nodeTypes } from './nodes';
import { edgeTypes, initialEdges } from '.';
import { ApiInfoBar } from './ApiInfoBar';
import { getPaths } from './Save';
import { setPaths } from './Load';
//import { AppNode } from './misc/nodes/types';

export default function App() {
  const [title, setTitle] = useState('My New API');
  const [version, setVersion] = useState('0.0.1');
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);

  const setLayout = useCallback(
    (direction: 'TB' | 'LR') => {
      const { nodes: layoutedNodes, edges: layoutedEdges } = setPaths(getPaths(rfInstance), direction);
      setNodes([...layoutedNodes]);
      setEdges([...layoutedEdges]);
    },
    []//[nodes, edges, setNodes, setEdges]
  );

  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((edges) => addEdge(connection, edges)),
    [setEdges]
  );

  const getApi = () => {
    return {
      openapi: "3.0.0",
      info: { title, version },
      paths: getPaths(rfInstance)
    };
  };

  const setApi = (newApi: any) => {
    setTitle(newApi.info.title);
    setVersion(newApi.info.version);
    const { nodes, edges } = setPaths(newApi.paths);
    setNodes(nodes);
    setEdges(edges);
  };

  useEffect(() => {
    //console.log(getPaths())
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
        onInit={setRfInstance}
        connectionLineType="smoothstep"
        fitView
      >
        <Background />
        <MiniMap />
        <Controls />
        <Panel position="top-left">
          <LoadApiDialog setApi={setApi} />
          <button onClick={() => downloadApi(getApi())}>save</button>
          <button onClick={() => showApiPreviewDialog(getApi())}>preview</button>
          <button onClick={() => setLayout('TB')}>vertical layout</button>
          <button onClick={() => setLayout('LR')}>horizontal layout</button>
          <button onClick={() => console.log(getPaths(rfInstance))}>get paths</button>
        </Panel>
      </ReactFlow>
    </ReactFlowProvider>
  );
}
