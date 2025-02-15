import * as monaco from 'monaco-editor';


// Store the current schema decoration IDs
let currentSchemaDecorations: string[] = [];


function highlightSchemaEditor(editor: monaco.editor.IStandaloneCodeEditor, schemaName: string) {
    const model = editor.getModel();
    if (!model) return;
  
    // Clear existing decorations properly
    currentSchemaDecorations = editor.deltaDecorations(currentSchemaDecorations, []);
  
    // If empty schema name, just clear decorations and return
    if (!schemaName) return;
  
    const text = model.getValue();
    const lines = text.split('\n');
    
    // Find the schemas section
    let inSchemas = false;
    let schemaIndentation = -1;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Find schemas section
      if (line.includes('schemas:')) {
        inSchemas = true;
        schemaIndentation = line.search(/\S/);
        continue;
      }
      
      if (inSchemas) {
        // Check if we're still in schemas section based on indentation
        const currentIndentation = line.search(/\S/);
        if (currentIndentation <= schemaIndentation && currentIndentation !== -1) {
          inSchemas = false;
          continue;
        }
        
        // Check if this line contains our schema
        if (line.trim().startsWith(schemaName + ':')) {
          // Find the range of the schema definition
          const startLineNumber = i + 1;
          let endLineNumber = startLineNumber;
          const schemaIndent = line.search(/\S/);
          
          // Find the end of the schema definition
          for (let j = startLineNumber; j < lines.length; j++) {
            const nextLine = lines[j];
            const nextIndent = nextLine.search(/\S/);
            if (nextIndent <= schemaIndent && nextIndent !== -1 && nextLine.trim() !== '') {
              break;
            }
            endLineNumber = j + 1;
          }
          
          // Add decoration and store the IDs
          currentSchemaDecorations = editor.deltaDecorations([], [
            {
              range: new monaco.Range(startLineNumber - 1, 1, endLineNumber, 1),
              options: {
                isWholeLine: true,
                className: 'highlighted-line',
              }
            }
          ]);
          
          // Reveal the highlighted lines
          editor.revealLinesInCenter(startLineNumber - 1, endLineNumber);
          break;
        }
      }
    }
  }
  export default highlightSchemaEditor;