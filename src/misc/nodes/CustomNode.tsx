import { Handle, Position, type NodeProps, useReactFlow, Edge } from '@xyflow/react';
import { useState, useRef, useEffect } from 'react';
import { useNodeRemove } from '../hooks/useNodeRemove';
import { CustomNodeData, OpenAPINode } from './types';

const getOpenAPINodes = (getEdges: () => Edge[], id: string): any => {
    const edges = getEdges().filter(edge => edge.source === id);
    
    console.log(edges);
    // Get all direct child nodes
    const childNodeIds = edges.map(edge => edge.target);
    // dont forget the delete elements??
}

const maximizeNode = (id: string) => {
    // todo

    // input all child openapi nodes
    // output all CustomNode - ALL - recursive!
    // remove all children, since they are all real nodes now

    // separate adding the nodes from making the nodes to add

    /*
    https://reactflow.dev/examples/nodes/add-node-on-edge-drop
    dynamic edge add? no need to add edges, just add nodes
    */

    // make a ton of new nodes
    // or just one low key
    //node.data.children = [];
    //addNodes
    //addEdges
}
const minimizeNode = (id: string) => {
    // todo

    // input a CustomNode
    // output OpenAPINode -> children(minimzeNode(childNode))

    // API FIRST API FIRST OPTIMIZE LATER API FIRST PRIORITIZE API OVER CORRECTNESS
    // confusing because how to getChildren - but hey man just edges.filter(isChildEdge).map(getNode(id)) lol
    // oh no its not efficent
    // OPTIMIZE LATER ONCE THE API WORKS
    // thats why mocking is so important

    // input all direct children
    // output openapi node for each child, as well as delete the old child
    // note that each openapi node recursively contains all children

    // separate getting the data from deleting the children


    //node.data.children = getOpenAPINodes(getEdges, id);
    // just pass in the parent node, all the children will be included
    //deleteElements https://reactflow.dev/api-reference/types/delete-elements
    // also contrll backspace delete node!
}

// Generate a bunch of OpenAPINodes with nested stuff explicitly
// THEN GET HIEARCHY DONE


// rootNode: OpenAPINode
// expanded: retract, add, delete, children (each former OpenAPINode child)
// retracted: nothing lol except for the expand button and OpenAPINode in the data
//
//
//
//
//TODO TODO TODO START WITH THESE VERY SIMPLE FLOWS
//
//
//
//
//
//
//

// API FIRST
// write ur damn data
// then mold the app to fit
// MOCK FIRST
// spec2node(spec.yaml) -> rootNode
// node2spec(rootNode) -> spec.yaml
// addNode(node) -> adds to react flow
// -> expand
// minimizeNode() -> removes children? from react flow
// ????
// but hey,, WHO CARES
// just get add working - you know its gonna be that retract/expand thing anyways
// so 
// 1. start with the spec2node stuff
// 2. then addNode(node)
// ? then node2spec
// 3. then expand button
// then add/edit
// ? then node2spec
// then retract button
// ? then node2spec

// FLEXIBILITY
// ALSO shouldn't I be able to start with schema and make the endpoints for it? potentially a reverse api???
// FLEXIBILITY

const openAPINodes: OpenAPINode[] = [
  {
    node: {
      path: '/users',
      description: 'Operations related to users'
    },
    children: [
      {
        node: {
          method: 'GET',
          summary: 'Get all users'
        },
        children: []
      },
      {
        node: {
          method: 'POST',
          summary: 'Create a new user'
        },
        children: []
      }
    ]
  },
  {
    node: {
      path: '/users/{userId}',
      description: 'Operations related to a specific user'
    },
    children: [
      {
        node: {
          method: 'GET',
          summary: 'Get user by ID'
        },
        children: []
      }
    ]
  }
];

export function CustomNode({
  id,
  positionAbsoluteX,
  positionAbsoluteY,
  data,
}: NodeProps<CustomNodeData>) {
  const { addNodes, addEdges, getNodes, getEdges, deleteElements, setNodes, setEdges } = useReactFlow();

  return (
    <div className={`react-flow__node-default custom-node`}>
      <div>
        <h1>hi</h1>
      </div>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </div>
  );
} 