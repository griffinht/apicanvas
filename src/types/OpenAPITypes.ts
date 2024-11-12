export interface OpenAPISchema {
  openapi: string;
  info: {
    title: string;
    version: string;
  };
  paths: {
    [key: string]: {
      [method: string]: {
        summary?: string;
        description?: string;
        parameters?: any[];
        responses?: any;
      };
    };
  };
}

export interface FlowNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: {
    label: string;
    details?: any;
    nodeType?: 'root' | 'path' | 'method';
  };
}

export interface FlowEdge {
  id: string;
  source: string;
  target: string;
  type?: string;
}

export interface LayoutOptions {
  nodeWidth: number;
  nodeHeight: number;
  rankdir?: 'TB' | 'LR';
  align?: 'UL' | 'UR' | 'DL' | 'DR';
  ranksep?: number;
  nodesep?: number;
} 