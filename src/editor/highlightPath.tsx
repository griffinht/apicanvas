import * as monaco from 'monaco-editor';

// Function to highlight a specific path in the editor
const highlightPath = (editor: monaco.editor.IStandaloneCodeEditor, path: string) => {
    const model = editor.getModel();
    if (!model) return;

    // Clear previous decorations
    editor.deltaDecorations([], []);

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
      editor.deltaDecorations([], decorations);

      // Reveal the line
      editor.revealLineInCenter(lineIndex + 1);
    }
  };

  export default highlightPath;
