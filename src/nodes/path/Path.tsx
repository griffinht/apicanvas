import { addMethodNode } from '../method/Add';
import { addPathNode } from './Add';
import { editPathSegment } from './Edit';
import { deletePathNode } from './Delete';
import { collapsePathNode } from './Collapse';
import { ReactFlowInstance, Node } from '@xyflow/react';

export interface PathNodeProps {
  segment: string;
  nodeId: string;
  rfInstance: ReactFlowInstance;
  direction: 'TB' | 'LR';
}

export function getPathNodeStyle(segment: string) {
  const isParameter = (segment: string) => segment.match(/^\{.*\}$/);
  
  return {
    background: isParameter(segment) ? '#2d3748' : '#fff',
    border: '1px solid #2d3748',
    width: '24px',
    height: '24px',
    padding: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '2px',
  };
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
    style: getPathNodeStyle(segment)
  };
}

export function PathNode({ segment, nodeId, rfInstance, direction }: PathNodeProps) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      position: 'relative',
      width: '100%',
      height: '100%',
      justifyContent: 'center',
    }}>
      <div style={{
        position: 'absolute',
        right: '100%',
        top: '100%',
        transform: 'translate(0, -50%)',
        whiteSpace: 'nowrap',
        fontFamily: 'monospace',
        fontSize: '1.1em',
        color: '#2d3748',
        pointerEvents: 'none',
        zIndex: 20,
        marginRight: '8px',
        marginTop: '4px',
      }}>
        {segment}
      </div>

      <div style={{
        backgroundColor: '#fff',
        padding: '4px 8px',
        borderRadius: '4px',
        border: '1px solid #ddd',
        display: 'flex',
        gap: '4px',
        opacity: 0,
        transition: 'opacity 0.2s ease',
        position: 'absolute',
        left: '100%',
        top: '50%',
        transform: 'translateY(-50%)',
        marginLeft: '8px',
        zIndex: 10,
      }}
      onMouseEnter={e => e.currentTarget.style.opacity = '1'}
      onMouseLeave={e => e.currentTarget.style.opacity = '0'}
      >
        <button 
          onClick={() => addMethodNode(nodeId, rfInstance, direction)}
          style={{ fontSize: '0.9em' }}
        >
          + GET
        </button>
        <button 
          onClick={() => addPathNode(nodeId, rfInstance, direction)}
          style={{ fontSize: '0.9em' }}
        >
          + endpoint
        </button>
        <button 
          onClick={() => deletePathNode(nodeId, rfInstance, direction)}
          style={{ fontSize: '0.9em' }}
        >
          X
        </button>
        <button 
          onClick={() => collapsePathNode(nodeId, rfInstance, direction)}
          style={{ fontSize: '0.9em' }}
        >
          -
        </button>
      </div>
    </div>
  );
} 