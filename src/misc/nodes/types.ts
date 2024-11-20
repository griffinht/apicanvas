import type { Node, BuiltInNode } from '@xyflow/react';


const getRandomMethod = () => {
    const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
    return methods[Math.floor(Math.random() * methods.length)];
  };
  
  const getRandomNodeData = (): OpenAPINode => {
    const isPath = Math.random() > 0.5;
    
    if (isPath) {
      return {
        node: {
          path: `/path${Math.floor(Math.random() * 100)}`,
          description: 'Random path description'
        },
        children: []
      };
    }
  
    return {
      node: {
        method: getRandomMethod(),
        summary: 'Random method summary'
      }, 
      children: []
    };
  };

export type Path = {
    path: string;
    description: string | null;
}
export type Method = {
    method: string;
    summary: string | null;
}
export type OpenAPINode = {
    path: Path;
    children: OpenAPINode[];
    methods: Method[];
}
export type CustomNodeData = Node<{ data: OpenAPINode }, 'custom-node'>;
export type AppNode = BuiltInNode | CustomNodeData;
