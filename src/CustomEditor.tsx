import { Editor } from "@monaco-editor/react";
import { useEffect } from "react";

interface CustomEditorProps {
  onMount?: (editor: any) => void;
  onChange?: (value: string | undefined) => void;
}

export function CustomEditor({ onMount, onChange }: CustomEditorProps) {
  useEffect(() => {
    const savedContent = localStorage.getItem('editorContent');
    if (savedContent && (window as any).editor) {
      (window as any).editor.setValue(savedContent);
    }
  }, []);

  return (
    <Editor 
      height="100%"
      defaultLanguage="json"
      onMount={(editor) => {
        (window as any).editor = editor;
        const savedContent = localStorage.getItem('editorContent');
        if (savedContent) {
          editor.setValue(savedContent);
        }
        onMount?.(editor);
      }}
      onChange={(value) => {
        if (!value) return;
        localStorage.setItem('editorContent', value);
        onChange?.(value);
      }}
    />
  );
} 