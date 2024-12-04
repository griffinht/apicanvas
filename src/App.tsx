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
import { edgeTypes, initialEdges } from '.';
import { ApiInfoBar } from './ApiInfoBar';
import dagre from '@dagrejs/dagre';
//import { AppNode } from './misc/nodes/types';

const nodeWidth = 150;
const nodeHeight = 40;
const dagreGraph = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));

const getLayoutedElements = (nodes: any[], edges: any[], direction = 'TB') => {
  const isHorizontal = direction === 'LR';
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const newNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      targetPosition: isHorizontal ? 'left' : 'top',
      sourcePosition: isHorizontal ? 'right' : 'bottom',
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    };
  });

  return { nodes: newNodes, edges };
};

export default function App() {
  const [title, setTitle] = useState('My New API');
  const [version, setVersion] = useState('0.0.1');
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);

  const onLayout = useCallback(
    (direction: 'TB' | 'LR') => {
      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(nodes, edges, direction);
      setNodes([...layoutedNodes]);
      setEdges([...layoutedEdges]);
    },
    [nodes, edges, setNodes, setEdges]
  );

  const getPaths = () => {
    if (!rfInstance) return {};
    const flowData = rfInstance.toObject();
    // nodes and edges
    return {};
  };

  const setPaths = (paths: any) => {
    // Create initial nodes
    const initialNodes = [
      { id: 'users', data: { label: 'users' } },
      { id: 'userId', data: { label: '{userId}' } },
      { id: 'posts', data: { label: 'posts' } },
      { id: 'users-get', data: { label: 'GET' } },
      { id: 'users-post', data: { label: 'POST' } },
      { id: 'userId-get', data: { label: 'GET' } },
      { id: 'userId-put', data: { label: 'PUT' } },
      { id: 'userId-delete', data: { label: 'DELETE' } },
      { id: 'posts-get', data: { label: 'GET' } },
    ].map(node => ({ ...node, type: 'default', position: { x: 0, y: 0 } }));

    const initialEdges = [
      { id: 'e-users-get', source: 'users', target: 'users-get' },
      { id: 'e-users-post', source: 'users', target: 'users-post' },
      { id: 'e-users-userId', source: 'users', target: 'userId' },
      { id: 'e-userId-get', source: 'userId', target: 'userId-get' },
      { id: 'e-userId-put', source: 'userId', target: 'userId-put' },
      { id: 'e-userId-delete', source: 'userId', target: 'userId-delete' },
      { id: 'e-userId-posts', source: 'userId', target: 'posts' },
      { id: 'e-posts-get', source: 'posts', target: 'posts-get' }
    ].map(edge => ({ ...edge, type: 'smoothstep', animated: true }));

    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      initialNodes,
      initialEdges,
      'LR'
    );

    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
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
          <button onClick={() => onLayout('TB')}>vertical layout</button>
          <button onClick={() => onLayout('LR')}>horizontal layout</button>
        </Panel>
      </ReactFlow>
    </ReactFlowProvider>
  );
}
