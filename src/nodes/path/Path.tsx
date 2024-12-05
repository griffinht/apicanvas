import { addMethodNode } from '../method/Add';
import { addPathNode } from './Add';
import { editPathSegment } from './Edit';
import { deletePathNode } from './Delete';
import { ReactFlowInstance } from '@xyflow/react';

interface PathNodeProps {
  segment: string;
  nodeId: string;
  rfInstance: ReactFlowInstance;
}

export function PathNode({ segment, nodeId, rfInstance }: PathNodeProps) {
  return (
    <div>
      <input 
        type="text"
        defaultValue={segment}
        onChange={(e) => editPathSegment(nodeId, e.target.value)}
        onClick={(e) => e.stopPropagation()}
        style={{ fontSize: 'inherit', width: '100px' }}
      />
      <div>
        <button onClick={() => addMethodNode(nodeId, rfInstance)}>+ GET</button>
        <button onClick={() => addPathNode(nodeId, rfInstance)}>+ endpoint</button>
        <button onClick={() => deletePathNode(nodeId, rfInstance)}>X</button>
      </div>
    </div>
  );
} 