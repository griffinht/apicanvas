export type HttpMethod = 'get' | 'post' | 'put' | 'delete' | 'patch';

export type PathItem = {
  path: string;
  methods: HttpMethod[];
  paths: PathItem[];
  minimized: boolean;
};

export interface OpenApiSpec {
  openapi: string;
  info: {
    title: string;
    version: string;
  };
  rootPath: PathItem;
}

export const getRandomMethod = (): HttpMethod => {
  const methods: HttpMethod[] = ['get', 'post', 'put', 'delete', 'patch'];
  return methods[Math.floor(Math.random() * methods.length)];
};

export const createRandomPathItem = (): PathItem => {
  return {
    path: 'new-path',
    methods: [getRandomMethod()],
    paths: [],
    minimized: false
  };
}; 