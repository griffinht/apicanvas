export function Save() {
  const handleSave = async () => {
    const editorContent = (window as any).editor?.getValue();
    if (!editorContent) {
      alert('No content to save');
      return;
    }

    try {
      // Create a handle to save the file
      const handle = await window.showSaveFilePicker({
        suggestedName: 'openapi-spec.json',
        types: [{
          description: 'JSON Files',
          accept: {
            'application/json': ['.json'],
          },
        }],
      });

      // Create a FileSystemWritableFileStream to write to
      const writable = await handle.createWritable();

      // Write the contents of the file to the stream
      await writable.write(editorContent);

      // Close the file and write the contents to disk
      await writable.close();
    } catch (error) {
      // User cancelled or API not supported
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error('Error saving file:', error);
        alert('Failed to save file');
      }
    }
  };

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        handleSave();
      }}
      style={{ margin: '12px 0', width: '70px' }}
    >
      save
    </button>
  );
} 