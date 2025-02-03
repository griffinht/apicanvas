import { Editor } from "@monaco-editor/react";
import { useEffect } from "react";

interface CustomEditorProps {
  onMount?: (editor: any) => void;
  onChange?: (value: string | undefined) => void;
  defaultValue?: string;  
}

export function CustomEditor({ onMount, onChange, defaultValue }: CustomEditorProps) {
  const openApiExample = `{
  "openapi": "3.0.0",
  "info": {
    "title": "Example API",
    "description": "This is a sample API definition in OpenAPI 3.0 format.",
    "version": "1.0.0"
  },
  "paths": {
    "/users": {
      "get": {
        "summary": "Get a list of users",
        "operationId": "getUsers",
        "responses": {
          "200": {
            "description": "A list of users.",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "properties": {
                      "id": {
                        "type": "integer"
                      },
                      "name": {
                        "type": "string"
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}`;

  const initialValue = localStorage.getItem("editorContent") || defaultValue || openApiExample;

  useEffect(() => {
    if ((window as any).editor) {
      (window as any).editor.setValue(initialValue);
    }
  }, []);

  return (
    
    <Editor
      height="100%"
      defaultLanguage="json"
      defaultValue={initialValue} 
      onMount={(editor) => {
        (window as any).editor = editor;
        const savedContent = localStorage.getItem("editorContent");
        if (savedContent) {
          editor.setValue(savedContent);
        } else {
          editor.setValue(initialValue);
        }
        onMount?.(editor);
      }}
      onChange={(value) => {
        if (!value) return;
        localStorage.setItem("editorContent", value);
        onChange?.(value);
      }}
    />
  );
}