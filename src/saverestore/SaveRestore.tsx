import { Panel } from "@xyflow/react";

import { ReactFlow } from "@xyflow/react";

import { useCallback } from "react";

import { useNodesState, useEdgesState, useReactFlow, useNodes, useEdges, addEdge, OnConnect } from '@xyflow/react';
import { initialNodes, nodeTypes } from '../nodes';
import { useState } from 'react';
import { edgeTypes, initialEdges } from '../edges';

const SaveRestore = ({ children }: { children: React.ReactNode }) => {
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
            const flow = rfInstance;
            console.log(flow);
        } else {
            console.error('rfInstance is null');
        }
    }, [rfInstance]);

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
        {children}
        </ReactFlow>
    );
};

export default SaveRestore;