import { ReactFlowInstance } from '@xyflow/react';
import { getPaths } from '../../Save';
import { setPaths } from '../../Load';
import { getSchemas, createSchemaNodes } from './components/SchemaManager';
import { dump as yamlDump, load as yamlLoad } from 'js-yaml';

interface ApiInfo {
  title: string;
  version: string;
}

export function validateApi(api: any) {
  if (!api.openapi) {
    throw new Error('missing openapi version');
  }
  if (!api.openapi.startsWith('3.')) {
    throw new Error('unsupported openapi version ' + api.openapi + ', only OpenAPI 3.x.x is supported');
  }
  if (!api.info) {
    throw new Error('missing info');
  }
  if (!api.info.title) {
    throw new Error('missing info.title');
  }
  if (!api.info.version) {
    throw new Error('missing info.version');
  }
  if (!api.paths) {
    throw new Error('missing paths');
  }
}

export function getApi(rfInstance: ReactFlowInstance, info: ApiInfo) {
  if (!rfInstance) {
    throw new Error('rfInstance is not set');
  }

  return {
    openapi: "3.0.0",
    info: { title: info.title, version: info.version },
    paths: getPaths(rfInstance),
    components: {
      schemas: getSchemas(rfInstance.getNodes())
    }
  };
}

export function setApi(
  api: any,
  rfInstance: ReactFlowInstance,
  direction: 'TB' | 'LR',
  callbacks: {
    setTitle: (title: string) => void;
    setVersion: (version: string) => void;
    setNodes: (nodes: any) => void;
    setEdges: (edges: any) => void;
  }
) {
  try {
    if (!rfInstance) {
      throw new Error('rfInstance is not set');
    }

    validateApi(api);
    
    callbacks.setTitle(api.info.title);
    callbacks.setVersion(api.info.version);

    const { nodes: pathNodes, edges: pathEdges } = setPaths(api.paths, direction, rfInstance);
    const { nodes: schemaNodes, edges: schemaEdges } = createSchemaNodes(api.components?.schemas || {}, rfInstance);

    callbacks.setNodes([...pathNodes, ...schemaNodes]);
    callbacks.setEdges([...pathEdges, ...schemaEdges]);
  } catch (error) {
    console.error('Error setting API:', error);
    if (error instanceof Error) {
      console.error('Stack trace:', error.stack);
    }
    throw error;
  }
}

export function saveToEditor(rfInstance: ReactFlowInstance, info: ApiInfo) {
  const api = getApi(rfInstance, info);
  (window as any).editor?.setValue(yamlDump(api, { indent: 2 }));
  console.log('Saved API to editor');
}

export function loadFromEditor(
  rfInstance: ReactFlowInstance,
  direction: 'TB' | 'LR',
  callbacks: {
    setTitle: (title: string) => void;
    setVersion: (version: string) => void;
    setNodes: (nodes: any) => void;
    setEdges: (edges: any) => void;
  }
) {
  const value = (window as any).editor?.getValue();
  if (!value) return;
  
  try {
    const parsedApi = yamlLoad(value);
    setApi(parsedApi, rfInstance, direction, callbacks);
    console.log('Loaded API from editor');
  } catch (error) {
    console.error('Error parsing YAML:', error);
    throw error;
  }
} 