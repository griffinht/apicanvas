import {
  ReactFlowProvider,
  Background,
  Controls,
  MiniMap,
  Panel,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';

import SaveRestore from './saverestore/SaveRestore';
import { useState } from 'react';
import { LoadApiDialog} from './saverestore/LoadApiDialog';
import { showApiDialogSave as downloadApi } from './saverestore/SaveApiDialog';
import { showApiPreviewDialog } from './saverestore/PreviewDialog';
import { OpenAPISpec } from './OpenAPISpec';

export default function App() {
  const [title, setTitle] = useState('My New API');
  const [version, setVersion] = useState('0.0.1');
  const [paths, setPaths] = useState({});

  const getApi = () => {
    return {
      openapi: "3.0.0",
      info: { title, version },
      paths
    };
  };
  // Simple safety wrapper
  const setApi = (newApi: any) => {
    setTitle(newApi.info.title);
    setVersion(newApi.info.version);
    setPaths(newApi.paths);
  };

  return (
    <ReactFlowProvider>
      <div className="api-info">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value || 'Untitled API')}
          style={{ fontSize: 'inherit', fontWeight: 'bold' }}
        />
        {' - v'}
        <input
          type="text"
          value={version}
          onChange={(e) => setVersion(e.target.value || '0.0.1')}
          style={{ fontSize: 'inherit', width: '60px' }}
        />
      </div>
      <SaveRestore>
        <Background />
        <MiniMap />
        <Controls />
        <Panel position="top-left">
          <LoadApiDialog setApi={setApi} />
          <button onClick={() => downloadApi(getApi())}>save</button>
          <button onClick={() => showApiPreviewDialog(getApi())}>preview</button>
        </Panel>
      </SaveRestore>
    </ReactFlowProvider>
  );
}
