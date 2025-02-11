import React, { useState } from 'react';
import { ReactFlowInstance } from '@xyflow/react';
import './SchemaNode.css';

interface SchemaProperty {
  type: string;
  format?: string;
  description?: string;
  example?: any;
  enum?: string[];
  items?: any;
  $ref?: string;
}

interface SchemaDefinition {
  type: string;
  properties: {
    [key: string]: SchemaProperty;
  };
  xml?: {
    name: string;
    wrapped?: boolean;
  };
}

interface SchemaEditorProps {
  schema: SchemaDefinition;
  onSchemaChange: (schema: SchemaDefinition) => void;
  rfInstance: ReactFlowInstance;
}

const PropertyEditor: React.FC<{
  name: string;
  property: SchemaProperty;
  onPropertyChange: (name: string, property: SchemaProperty) => void;
  onDeleteProperty: (name: string) => void;
}> = ({ name, property, onPropertyChange, onDeleteProperty }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onPropertyChange(name, { ...property, type: e.target.value });
  };

  const handleFormatChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onPropertyChange(name, { ...property, format: e.target.value });
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onPropertyChange(name, { ...property, description: e.target.value });
  };

  const handleExampleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value: any = e.target.value;
    if (property.type === 'integer' || property.type === 'number') {
      value = Number(value);
    } else if (property.type === 'boolean') {
      value = value.toLowerCase() === 'true';
    }
    onPropertyChange(name, { ...property, example: value });
  };

  return (
    <div className="property-editor">
      <div className="property-editor-header">
        <div className="property-editor-name">{name}</div>
        <div className="property-editor-controls">
          <button
            className="property-editor-button"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? '▼' : '▶'}
          </button>
          <button
            className="property-editor-button delete"
            onClick={() => onDeleteProperty(name)}
          >
            🗑️
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="property-editor-content">
          <div className="property-editor-field">
            <label className="property-editor-label">Type:</label>
            <select
              className="property-editor-select"
              value={property.type}
              onChange={handleTypeChange}
            >
              <option value="string">string</option>
              <option value="integer">integer</option>
              <option value="number">number</option>
              <option value="boolean">boolean</option>
              <option value="array">array</option>
              <option value="object">object</option>
            </select>
          </div>

          {property.type === 'string' && (
            <div className="property-editor-field">
              <label className="property-editor-label">Format:</label>
              <select
                className="property-editor-select"
                value={property.format || ''}
                onChange={handleFormatChange}
              >
                <option value="">none</option>
                <option value="date">date</option>
                <option value="date-time">date-time</option>
                <option value="password">password</option>
                <option value="byte">byte</option>
                <option value="binary">binary</option>
              </select>
            </div>
          )}

          {property.type === 'integer' && (
            <div className="property-editor-field">
              <label className="property-editor-label">Format:</label>
              <select
                className="property-editor-select"
                value={property.format || ''}
                onChange={handleFormatChange}
              >
                <option value="">none</option>
                <option value="int32">int32</option>
                <option value="int64">int64</option>
              </select>
            </div>
          )}

          <div className="property-editor-field">
            <label className="property-editor-label">Description:</label>
            <input
              type="text"
              className="property-editor-input"
              value={property.description || ''}
              onChange={handleDescriptionChange}
            />
          </div>

          <div className="property-editor-field">
            <label className="property-editor-label">Example:</label>
            <input
              type="text"
              className="property-editor-input"
              value={property.example || ''}
              onChange={handleExampleChange}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export const SchemaEditor: React.FC<SchemaEditorProps> = ({
  schema,
  onSchemaChange,
  rfInstance
}) => {
  const [newPropertyName, setNewPropertyName] = useState('');

  const handlePropertyChange = (name: string, property: SchemaProperty) => {
    const newSchema = {
      ...schema,
      properties: {
        ...schema.properties,
        [name]: property
      }
    };
    onSchemaChange(newSchema);
  };

  const handleDeleteProperty = (name: string) => {
    const newProperties = { ...schema.properties };
    delete newProperties[name];
    onSchemaChange({
      ...schema,
      properties: newProperties
    });
  };

  const handleAddProperty = () => {
    if (!newPropertyName.trim()) return;
    
    onSchemaChange({
      ...schema,
      properties: {
        ...schema.properties,
        [newPropertyName]: {
          type: 'string'
        }
      }
    });
    setNewPropertyName('');
  };

  const handleXmlNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSchemaChange({
      ...schema,
      xml: {
        ...schema.xml,
        name: e.target.value
      }
    });
  };

  const handleXmlWrappedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSchemaChange({
      ...schema,
      xml: {
        ...schema.xml,
        wrapped: e.target.checked
      }
    });
  };

  return (
    <div className="schema-editor">
      <h3>Schema Editor</h3>

      <div className="property-editor-field">
        <label className="property-editor-label">XML Configuration:</label>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <input
            type="text"
            className="property-editor-input"
            placeholder="XML Name"
            value={schema.xml?.name || ''}
            onChange={handleXmlNameChange}
          />
          <label>
            <input
              type="checkbox"
              checked={schema.xml?.wrapped || false}
              onChange={handleXmlWrappedChange}
            />
            Wrapped
          </label>
        </div>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <h4>Properties</h4>
        {Object.entries(schema.properties).map(([name, property]) => (
          <PropertyEditor
            key={name}
            name={name}
            property={property}
            onPropertyChange={handlePropertyChange}
            onDeleteProperty={handleDeleteProperty}
          />
        ))}
      </div>

      <div className="add-property">
        <input
          type="text"
          className="add-property-input"
          value={newPropertyName}
          onChange={(e) => setNewPropertyName(e.target.value)}
          placeholder="New property name"
        />
        <button
          className="add-property-button"
          onClick={handleAddProperty}
        >
          Add Property
        </button>
      </div>
    </div>
  );
}; 