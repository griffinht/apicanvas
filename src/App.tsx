import { useCallback, useState } from 'react';
import {
  ReactFlow,
  Panel,
  ReactFlowProvider,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  type OnConnect,
  useReactFlow,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';

import { initialNodes, nodeTypes } from './nodes/index';
import { initialEdges, edgeTypes } from './edges';

const SaveRestore = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [rfInstance, setRfInstance] = useState(null);
  const { setViewport } = useReactFlow();
 
  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((edges) => addEdge(connection, edges)),
    [setEdges]
  );
  const onSave = useCallback(() => {
    if (rfInstance) {
      const flow = rfInstance.toObject();
      console.log('flow', flow);
    } else {
      console.error('rfInstance is null');
    }
  }, [rfInstance]);
 
  const onLoad = useCallback(() => {
    const restoreFlow = async () => {
      const flow = JSON.parse('');
 
      if (flow) {
        const { x = 0, y = 0, zoom = 1 } = flow.viewport;
        setNodes(flow.nodes || []);
        setEdges(flow.edges || []);
        setViewport({ x, y, zoom });
      }
    };
 
    restoreFlow();
  }, [setNodes, setViewport]);

  return (
    <ReactFlow
      nodes={nodes}
      nodeTypes={nodeTypes}
      onNodesChange={onNodesChange}
      edges={edges}
      edgeTypes={edgeTypes}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      // @ts-ignore
      onInit={setRfInstance}
      fitView
    >
      <Panel position="top-right">
        <button onClick={onSave}>save</button>
        <button onClick={onLoad}>load</button>
      </Panel>
      <Background />
      <MiniMap />
      <Controls />
    </ReactFlow>
  );
};

export default function App() {
  return (
    <ReactFlowProvider>
      <SaveRestore />
    </ReactFlowProvider>
  );
}
