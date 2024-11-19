import { Panel } from "@xyflow/react";

import { ReactFlow } from "@xyflow/react";

import { useCallback } from "react";

import { useNodesState, useEdgesState, useReactFlow, useNodes, useEdges, addEdge, OnConnect } from '@xyflow/react';
import { initialNodes, nodeTypes } from './nodes';
import { useState } from 'react';
import { edgeTypes, initialEdges } from './edges';
import { OpenAPISpec } from './OpenAPISpec';

const SaveRestore = ({ children, api, setApi }: { children: React.ReactNode, api: OpenAPISpec, setApi: (api: OpenAPISpec) => void }) => {
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
            //const flow = rfInstance.toObject();
            //console.log('flow', flow);
            console.log(api)
        } else {
            console.error('rfInstance is null');
        }
    }, [rfInstance]);

    const onLoad = useCallback(() => {
        const restoreFlow = async () => {
            let data = await fetch('public/openapi.json').then(res => res.json());

            // todo validate

            setApi(data);

            return;
            // todo
            const { x = 0, y = 0, zoom = 1 } = flow.viewport;
            setNodes(flow.nodes || []);
            setEdges(flow.edges || []);
            setViewport({ x, y, zoom });
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
        {children}
        </ReactFlow>
    );
};

export default SaveRestore;