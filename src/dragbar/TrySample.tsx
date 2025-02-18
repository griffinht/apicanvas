export function TrySample() {
  const handleTrySample = async () => {
    try {
      const response = await fetch('/openapi.yaml');
      if (!response.ok) {
        throw new Error('Failed to fetch sample API');
      }
      const sampleApi = await response.text();
      (window as any).editor?.setValue(sampleApi);
    } catch (error) {
      console.error('Error loading sample API:', error);
      alert('Failed to load sample API');
    }
  };

  return (
    <button

    id = "try-sample"
      onClick={(e) => {
        e.stopPropagation();
        handleTrySample();
      }}
    >
      Try sample
    </button>
  );
} 