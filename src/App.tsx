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

const DEFAULT_API = {
  openapi: '3.0.0',
  info: {
    title: 'My New API',
    version: '0.0.1'
  },
  paths: {}
};

export default function App() {
  const [api, setApiUnsafe] = useState(DEFAULT_API);

  // Simple safety wrapper
  const setApi = (api: any) => {
    if (!api) {
      throw new Error('missing api');
    }

    if (!api.openapi) {
      throw new Error('missing api.openapi');
    }

    if (!api.info) {
      throw new Error('missing api.info');
    }

    if (!api.info.title) {
      throw new Error('missing api.info.title');
    }

    if (!api.info.version) {
      throw new Error('missing api.info.version');
    }

    setApiUnsafe(api);
  };

  return (
    <ReactFlowProvider>
      <div className="api-info">
        <h3>{api.info.title} - v{api.info.version}</h3>
      </div>
      <SaveRestore api={api} setApi={setApi}>
        <Background />
        <MiniMap />
        <Controls />
        <Panel position="top-left">
          <LoadApiDialog setApi={setApi} />
          <button onClick={() => downloadApi(api)}>save</button>
          <button onClick={() => showApiPreviewDialog(api)}>preview</button>
        </Panel>
      </SaveRestore>
    </ReactFlowProvider>
  );
}
