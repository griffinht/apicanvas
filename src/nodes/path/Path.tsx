import { addMethodNode } from '../method/Add';
import { addPathNode } from './Add';
import { editPathSegment } from './Edit';
import { deletePathNode } from './Delete';

interface PathNodeProps {
  segment: string;
  nodeId: string;
}

export function PathNode({ segment, nodeId }: PathNodeProps) {
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
        <button onClick={() => addMethodNode(nodeId)}>+ GET</button>
        <button onClick={() => addPathNode(nodeId)}>+ endpoint</button>
        <button onClick={() => deletePathNode(nodeId)}>X</button>
      </div>
    </div>
  );
} 