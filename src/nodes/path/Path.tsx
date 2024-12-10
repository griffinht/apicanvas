import { addMethodNode } from '../method/Add';
import { addPathNode } from './Add';
import { editPathSegment } from './Edit';
import { deletePathNode } from './Delete';
import { collapsePathNode } from './Collapse';
import { ReactFlowInstance } from '@xyflow/react';

export interface PathNodeProps {
  segment: string;
  nodeId: string;
  rfInstance: ReactFlowInstance;
  direction: 'TB' | 'LR';
} 

export function PathNode({ segment, nodeId, rfInstance, direction }: PathNodeProps) {
  // Helper function to determine if segment is a parameter
  const isParameter = (segment: string) => segment.match(/^\{.*\}$/);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      position: 'relative',
    }}>
      <div style={{
        backgroundColor: isParameter(segment) ? '#2d3748' : '#f0f0f0',
        padding: '8px 12px',
        borderRadius: '4px',
        fontFamily: 'monospace',
        fontSize: '1.1em',
        color: isParameter(segment) ? '#f0f0f0' : '#2d3748',
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
        marginLeft: '8px',
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