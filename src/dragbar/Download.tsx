import { Download as DownloadIcon } from "lucide-react";

export function Download() {
  const handleDownload = () => {
    const editorContent = (window as unknown as { editor?: { getValue: () => string } }).editor?.getValue();
    
    if (!editorContent) {
      alert("No content to download");
      return;
    }

    try {
      const blob = new Blob([editorContent], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "openapi-spec.json";
      a.click();

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error);
      alert("Failed to download file");
    }
  };

  return (
    <button
      id="download"
      onClick={(e) => {
        e.stopPropagation();
        handleDownload();
      }}
      aria-label="Download OpenAPI Specification" data-tooltip="Download OpenAPI Specification"
    >
      <DownloadIcon size={18} />
      
    </button>
  );
}