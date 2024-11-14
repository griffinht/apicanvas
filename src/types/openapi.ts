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