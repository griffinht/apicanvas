export function Download() {
  const handleDownload = () => {
    const editorContent = (window as any).editor?.getValue();
    if (!editorContent) {
      alert('No content to download');
      return;
    }

    try {
      const blob = new Blob([editorContent], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'openapi-spec.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('Failed to download file');
    }
  };

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        handleDownload();
      }}
      style={{ margin: '12px 0', width: '70px' }}
    >
      download
    </button>
  );
} 