import { Save as SaveIcon } from "lucide-react";

export function Save() {
  const handleSave = async () => {
    const editorContent = (window as unknown as { editor?: { getValue: () => string } }).editor?.getValue();
    if (!editorContent) {
      alert("No content to save");
      return;
    }

    try {
      if (!("showSaveFilePicker" in window)) {
        throw new Error("File System Access API not supported");
      }

      const handle = await (window as any).showSaveFilePicker({
        suggestedName: "openapi-spec.json",
        types: [
          {
            description: "JSON Files",
            accept: { "application/json": [".json"] },
          },
        ],
      });

      const writable = await handle.createWritable();
      await writable.write(editorContent);
      await writable.close();
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") {
        console.error("Error saving file:", error);
        if (error.message === "File System Access API not supported") {
          alert("Your browser doesn't support saving files. Try using the download button instead.");
        } else {
          alert("Failed to save file");
        }
      }
    }
  };

  return (
    <button 
      onClick={(e) => {
        e.stopPropagation();
        handleSave();
      }}
      id="save"
      aria-label="Save OpenAPI Specification"  data-tooltip="Save OpenAPI Specification"
    >
      <SaveIcon size={18} />
    </button>
  );
}