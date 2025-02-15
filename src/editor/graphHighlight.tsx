import * as monaco from 'monaco-editor';

// Store the current decoration IDs
let currentDecorations: string[] = [];

// Function to extract path from a line and its context
export const getPathFromLine = (line: string, lineNumber: number, editor: monaco.editor.IStandaloneCodeEditor): string | null => {
  const model = editor.getModel();
  if (!model) return null;

  // If the current line is a path, return it directly
  const trimmedLine = line.trim();
  if (trimmedLine.startsWith('/')) {
    return trimmedLine.split(':')[0].trim();
  }

  // If not, search upwards for the parent path
  let currentLineNumber = lineNumber;
  let indentationLevel = getIndentationLevel(line);
  
  while (currentLineNumber > 1) {
    currentLineNumber--;
    const previousLine = model.getLineContent(currentLineNumber);
    const previousIndentation = getIndentationLevel(previousLine);

    // If we find a line with less indentation and it starts with '/',
    // this is our parent path
    if (previousIndentation < indentationLevel && previousLine.trim().startsWith('/')) {
      return previousLine.trim().split(':')[0].trim();
    }
  }

  return null;
};

// Helper function to get the indentation level of a line
const getIndentationLevel = (line: string): number => {
  const match = line.match(/^(\s*)/);
  return match ? match[1].length : 0;
};

// Function to clear current highlights
export const clearHighlight = (editor: monaco.editor.IStandaloneCodeEditor) => {
  currentDecorations = editor.deltaDecorations(currentDecorations, []);
};

// Function to highlight a specific path in the editor
const highlightPath = (editor: monaco.editor.IStandaloneCodeEditor, path: string) => {
    const model = editor.getModel();
    if (!model) return;

    // Clear previous decorations
    clearHighlight(editor);

    // Find the line containing the path
    const content = model.getValue();
    const lines = content.split('\n');

    // Normalize the search path (make case insensitive for userId/userid)
    const normalizedSearchPath = path.toLowerCase().replace(/{userid}/, '{userId}');
    
    const lineIndex = lines.findIndex(line => {
      const trimmedLine = line.trim();
      // Look for the path in YAML format (with indentation and colon)
      if (trimmedLine.startsWith('/')) {
        const pathPart = trimmedLine.split(':')[0].trim();
        const normalizedPathPart = pathPart.toLowerCase().replace(/{userid}/, '{userId}');
        return normalizedPathPart === normalizedSearchPath;
      }
      return false;
    });

    if (lineIndex !== -1) {
      // Add new decoration
      const decorations = [{
        range: new monaco.Range(lineIndex + 1, 1, lineIndex + 1, 1000),
        options: {
          isWholeLine: true,
          className: 'highlighted-line',
          inlineClassName: 'highlighted-text'
        }
      }];
      currentDecorations = editor.deltaDecorations(currentDecorations, decorations);

      // Get and log the path from the current line
      const currentLine = lines[lineIndex];
      const extractedPath = getPathFromLine(currentLine, lineIndex + 1, editor);
      if (extractedPath) {
        console.log('Current path:', extractedPath, 'todo is to center the graph view on the corresponding path node');
      }

      // Reveal the line
      editor.revealLineInCenter(lineIndex + 1);
    }
};

export default highlightPath;
