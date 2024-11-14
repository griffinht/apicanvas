import { OpenApiSpec, PathItem, HttpMethod } from '../types/openapi';

const isHttpMethod = (method: string): method is HttpMethod => {
  return ['get', 'post', 'put', 'delete', 'patch'].includes(method.toLowerCase());
};

const buildPathTree = (paths: Record<string, any>) => {
  // Split each path into segments and build the tree
  const rootPath: PathItem = {
    path: '/',
    methods: [],
    paths: [],
    minimized: false
  };

  Object.entries(paths).forEach(([pathString, pathData]) => {
    const segments = pathString.split('/').filter(Boolean);
    let currentNode = rootPath;

    // Build the path tree
    segments.forEach((segment, index) => {
      const pathSegment = `/${segment}`;
      let childNode = currentNode.paths.find(p => p.path === pathSegment);

      if (!childNode) {
        childNode = {
          path: pathSegment,
          methods: [],
          paths: [],
          minimized: false
        };
        currentNode.paths.push(childNode);
      }

      // If this is the last segment, add the HTTP methods
      if (index === segments.length - 1) {
        childNode.methods = Object.keys(pathData).filter(isHttpMethod);
      }

      currentNode = childNode;
    });
  });

  return rootPath;
};

export const loadOpenApiSpec = async (url: string): Promise<OpenApiSpec> => {
  try {
    const response = await fetch(url);
    const data = await response.json();

    const transformedSpec: OpenApiSpec = {
      openapi: data.openapi || '3.0.0',
      info: {
        title: data.info?.title || 'Untitled API',
        version: data.info?.version || '1.0.0'
      },
      rootPath: buildPathTree(data.paths || {})
    };

    return transformedSpec;
  } catch (error) {
    console.error('Error loading OpenAPI spec:', error);
    throw error;
  }
}; 