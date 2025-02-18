import * as monaco from 'monaco-editor';
import highlightPath from './highlightPath';
import Editor from '@monaco-editor/react';
import { dump as yamlDump } from 'js-yaml';
import { getPathFromLine } from './graphHighlight';
import highlightSchemaEditor from './highlightSchema';

interface CustomEditorProps {
  onMount?: (editor: monaco.editor.IStandaloneCodeEditor) => void;
  onChange?: (value: string | undefined) => void;
  defaultValue?: string;
}

export function CustomEditor({ onMount, onChange }: Omit<CustomEditorProps, 'defaultValue'>) {
  const openApiExample = {
    openapi: "3.0.0",
    info: {
      title: "My New API",
      version: "0.0.1"
    },
    paths: {},
    components: {
      schemas: {}
    }
  };

  const initialValue = yamlDump(openApiExample, { indent: 2 });

  
  return (
    <>
      <style>
        {`
          .highlighted-line {
            background-color: rgba(107, 165, 57, 0.2);
          }
          .highlighted-text {
            font-weight: bold;
          }
        `}
      </style>
      <Editor
        height="100%"
        defaultLanguage="yaml"
        onMount={(editor) => {
          (window as any).editor = editor;
          (window as any).highlightPath = (path: string) => highlightPath(editor, path);
          (window as any).highlightSchemaEditor = (schemaName: string) => highlightSchemaEditor(editor, schemaName);
          
          // Add cursor position change listener
          editor.onDidChangeCursorPosition((e) => {
            const line = editor.getModel()?.getLineContent(e.position.lineNumber);
            if (line) {
              const path = getPathFromLine(line, e.position.lineNumber, editor);
              if (path) {
                console.log('Current path:', path);
              }
            }
          });

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
    </>
  );
}