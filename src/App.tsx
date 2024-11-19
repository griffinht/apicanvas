import {
  ReactFlowProvider,
  Background,
  Controls,
  MiniMap,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';

import SaveRestore from './SaveRestore';
import { useState } from 'react';

export default function App() {
  const [api, setApi] = useState({
    openapi: '3.0.0',
    info: {
      title: 'My New API',
      version: '0.0.1'
    },
    paths: {}
  });
  
  return (
    <ReactFlowProvider>
      <div className="api-info" style={{ position: 'absolute', top: 10, left: 10, zIndex: 10, background: 'white', padding: '10px', borderRadius: '4px' }}>
        <h3>{api.info.title} - v{api.info.version}</h3>
      </div>
      <SaveRestore api={api} setApi={setApi}>
        <Background />
        <MiniMap />
        <Controls />
      </SaveRestore>
    </ReactFlowProvider>
  );
}
