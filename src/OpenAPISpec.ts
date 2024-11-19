interface OpenAPISpec {
    openapi: string;
    info: {
        title: string;
        version: string;
    };
    paths: Record<string, any>;
}

export type { OpenAPISpec };