interface SchemaNode {
  id: string;
  type: string;
  data: { label: string | JSX.Element };
  position: { x: number; y: number };
  style: {
    background: string;
    padding: string;
    border: string;
    borderRadius: string;
    minWidth: string;
  };
}

interface SchemaData {
  [key: string]: {
    required?: string[];
    properties: {
      [key: string]: {
        type: string;
        format?: string;
        example?: any;
        ref?: string;
        items?: any;
        enum?: string[];
        description?: string;
      };
    };
  };
}

// Update the rendering part to handle refs
const renderType = (value: any) => {
  if (value.ref) {
    return (
      <span>
        {value.type === 'array' ? `[${value.items.ref}]` : value.ref}
      </span>
    );
  }
  
  if (value.type === 'array' && value.items) {
    return `[${value.items.type}]`;
  }
  
  return value.type + (value.format ? ` ($${value.format})` : '');
};

// Export the helper function
export const findSchemaRefs = (properties: any): string[] => {
  const refs: string[] = [];
  Object.values(properties).forEach((value: any) => {
    if (value.ref) {
      refs.push(value.ref);
    }
    if (value.type === 'array' && value.items?.ref) {
      refs.push(value.items.ref);
    }
  });
  return refs;
};

export const createSchemaNode = (
  schemaName: string,
  setEdges?: (edges: any) => void
): SchemaNode => {
  const schemas = getMockSchemas();
  const schemaData = schemas[schemaName];

  // Create edges for references if setEdges is provided
  if (setEdges) {
    const refs = findSchemaRefs(schemaData.properties);
    refs.forEach(refName => {
      setEdges((edges: any) => [
        ...edges,
        {
          id: `${schemaName}-${refName}`,
          source: `schema-${schemaName}`,
          target: `schema-${refName}`,
          type: 'smoothstep',
          animated: true,
          style: { stroke: '#999' }
        }
      ]);
    });
  }

  const label = (
    <div style={{ padding: '12px' }}>
      <div style={{ 
        fontWeight: 'bold', 
        marginBottom: '12px', 
        borderBottom: '1px solid #ccc',
        paddingBottom: '8px'
      }}>
        {schemaName}
      </div>
      <div style={{ fontSize: '12px' }}>
        {Object.entries(schemaData.properties).map(([key, value]: [string, any]) => (
          <div key={key} style={{ 
            marginBottom: '8px',
            paddingLeft: '8px',
            borderLeft: value.type === 'object' ? '2px solid #e8e8e8' : 'none'
          }}>
            <div style={{ display: 'flex', alignItems: 'baseline' }}>
              <span style={{ 
                color: '#3b4151',
                fontWeight: 'bold',
                minWidth: '100px'
              }}>
                {key}
                {schemaData.required?.includes(key) && 
                  <span style={{ color: 'red', marginLeft: '2px' }}>*</span>
                }
              </span>
              <span style={{ color: '#6b6b6b' }}>
                {renderType(value)}
              </span>
            </div>
            {value.description && (
              <div style={{ 
                color: '#666', 
                fontSize: '11px',
                marginTop: '2px',
                marginLeft: '100px'
              }}>
                {value.description}
              </div>
            )}
            {value.example && (
              <div style={{ 
                color: '#666',
                fontSize: '11px',
                marginTop: '2px',
                marginLeft: '100px'
              }}>
                example: {value.example}
              </div>
            )}
            {value.enum && (
              <div style={{ 
                color: '#666',
                fontSize: '11px',
                marginTop: '2px',
                marginLeft: '100px'
              }}>
                enum: [{value.enum.join(', ')}]
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return {
    id: `schema-${schemaName}`,
    type: 'default',
    data: { label },
    position: { x: 0, y: 0 },
    style: {
      background: '#fff',
      padding: '0',
      border: '1px solid #ccc',
      borderRadius: '4px',
      minWidth: '350px'
    }
  };
};

// Mock schemas with actual Petstore data
export const getMockSchemas = (): SchemaData => ({
  'Pet': {
    required: ['name', 'photoUrls'],
    properties: {
      id: { type: 'integer', format: 'int64', example: 10 },
      name: { type: 'string', example: 'doggie' },
      category: { type: 'object', ref: 'Category' },
      photoUrls: { type: 'array', items: { type: 'string' } },
      tags: { type: 'array', items: { ref: 'Tag' } },
      status: { 
        type: 'string', 
        enum: ['available', 'pending', 'sold'],
        description: 'pet status in the store'
      }
    }
  },
  'Category': {
    properties: {
      id: { type: 'integer', format: 'int64', example: 1 },
      name: { type: 'string', example: 'Dogs' }
    }
  },
  'Tag': {
    properties: {
      id: { type: 'integer', format: 'int64' },
      name: { type: 'string' }
    }
  }
});
