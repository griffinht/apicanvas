import * as monaco from 'monaco-editor';
import { useMonaco } from '@monaco-editor/react';
import Editor from '@monaco-editor/react';
import { dump as yamlDump } from 'js-yaml';

interface CustomEditorProps {
  onMount?: (editor: monaco.editor.IStandaloneCodeEditor) => void;
  onChange?: (value: string | undefined) => void;
  defaultValue?: string;
}

export function CustomEditor({ onMount, onChange, defaultValue }: CustomEditorProps) {
  const monaco = useMonaco();

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
    <Editor
      height="100%"
      defaultLanguage="yaml"
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