import { addMethodNode } from './methods/Add';
import { addPathNode } from './Add';
// @ts-ignore
import { editPathSegment } from './Edit';
import { deletePathNode } from './Delete';
import { collapsePathNode } from './Collapse';
import { ReactFlowInstance, Node } from '@xyflow/react';
import { Trash2, SquareMinus } from 'lucide-react';
import './PathNode.css'; // Import the CSS file
import highlightPath from './highlight';

export function changeTitle(nodeId: string, rfInstance: ReactFlowInstance, direction: 'TB' | 'LR') {
  const nodes = rfInstance.getNodes();
  const node = nodes.find(n => n.id === nodeId);
  if (!node) return;
  
  // Extract current segment from node data
  const currentSegment = (node.data?.label as { props: { segment: string } })?.props?.segment;
  const newSegment = prompt('Enter new path segment:', currentSegment);
  if (!newSegment || newSegment === currentSegment) return;

  // Update the node's style and data
  rfInstance.setNodes(nodes.map(n => {
    if (n.id === nodeId) {
      return {
        ...n,
        data: { 
          ...n.data,
          label: <PathNode 
            segment={newSegment} 
            nodeId={nodeId} 
            rfInstance={rfInstance} 
            direction={direction} 
          />
        },
        className: getPathNodeStyle(newSegment), // Use className instead of style
      };
    }
    return n;
  }));
}

export interface PathNodeProps {
  segment: string;
  nodeId: string;
  rfInstance: ReactFlowInstance;
  direction: 'TB' | 'LR';
}

export function getPathNodeStyle(segment: string) {
  const isParameter = (segment: string) => segment.match(/^\{.*\}$/);
  return isParameter(segment) ? 'path-node-parameter' : 'path-node-default';
}

export function createPathNode(
  segment: string, 
  nodeId: string, 
  rfInstance: ReactFlowInstance, 
  direction: 'TB' | 'LR',
  isHidden: boolean
): Node {
  return {
    id: nodeId,
    data: { 
      label: <PathNode 
        segment={segment} 
        nodeId={nodeId} 
        rfInstance={rfInstance} 
        direction={direction} 
      />
    },
    type: 'default',
    position: { x: 0, y: 0 },
    hidden: isHidden,
    className: getPathNodeStyle(segment), // Use className instead of style
  };
}

export function PathNode({ segment, nodeId, rfInstance, direction }: PathNodeProps) {
  return (
    <div 
      className="path-node-container"
      onMouseEnter={e => {
        const menu = e.currentTarget.querySelector('.hover-menu') as HTMLElement;
        if (menu) menu.style.opacity = '1';
        highlightPath(segment, nodeId, rfInstance);
      }}
      onMouseLeave={e => {
        const menu = e.currentTarget.querySelector('.hover-menu') as HTMLElement;
        if (menu) menu.style.opacity = '0';
      }}
    >
      <div className="path-node-segment">
        {segment}
      </div>

      <div 
        className="hover-menu"
      >
        <button 
          onClick={() => changeTitle(nodeId, rfInstance, direction)}
        >
          Edit Label
        </button>
        <button 
          onClick={() => addMethodNode(nodeId, rfInstance, direction)}
        >
          Attach operation
        </button>
        <button 
          onClick={() => addPathNode(nodeId, rfInstance, direction)}
        >
          Extend path
        </button>
        <button id="delete-path-node"
          onClick={() => deletePathNode(nodeId, rfInstance, direction)}
        >
          <Trash2 size={16} />
        </button>
        <button id="collapse-path-node"
          onClick={() => collapsePathNode(nodeId, rfInstance, direction)}
        >
          <SquareMinus size={16} />
        </button>
      </div>
    </div>
  );
}