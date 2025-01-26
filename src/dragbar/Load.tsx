import { useRef } from 'react';

export function Load() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLoad = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        // Try to parse JSON to validate
        JSON.parse(content);
        (window as any).editor?.setValue(content);
      } catch (error) {
        console.error('Error loading file:', error);
        alert('Invalid JSON file');
      }
    };
    reader.readAsText(file);
    // Reset the input so the same file can be loaded again
    event.target.value = '';
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleLoad}
        accept=".json"
        style={{ display: 'none' }}
      />
      <button
        onClick={(e) => {
          e.stopPropagation();
          fileInputRef.current?.click();
        }}
        style={{ margin: '12px 0', width: '70px' }}
      >
        load
      </button>
    </>
  );
} 