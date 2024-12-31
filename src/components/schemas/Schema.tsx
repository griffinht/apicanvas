interface SchemaNode {
  id: string;
  type: string;
  data: { label: string };
  position: { x: number; y: number };
  style: {
    background: string;
    padding: string;
    border: string;
    borderRadius: string;
  };
}

export const createSchemaNode = (
  schemaName: string
): SchemaNode => {
  return {
    id: `schema-${schemaName}`,
    type: 'default',
    data: { label: schemaName },
    position: { x: 0, y: 0 }, // Position will be set by layout
    style: {
      background: '#e6f3ff',
      padding: '10px',
      border: '1px solid #ccc',
      borderRadius: '5px'
    }
  };
};

// Mock schemas (temporary)
export const getMockSchemas = () => ({
  'Pet': {},
  'Store': {},
  'User': {}
});
