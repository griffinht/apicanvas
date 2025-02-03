import { useState } from "react";
import { Share2 as ShareIcon } from "lucide-react";

export function Share() {
  const [showModal, setShowModal] = useState(false);

  const handleShare = async () => {
    const editorContent = (window as unknown as { editor?: { getValue: () => string } }).editor?.getValue();
    if (!editorContent) {
      alert("No content to share");
      return;
    }
    setShowModal(true);
  };

  return (
    <>
      <button
      id="share"
        onClick={(e) => {
          e.stopPropagation();
          handleShare();
        }}
        aria-label="Share OpenAPI Specification"
      >
        <ShareIcon size={18} />
      </button>

      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "8px",
              maxWidth: "500px",
              color: "black",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ marginBottom: "10px" }}>How to Share Your Code</h3>
            <ol style={{ paddingLeft: "20px" }}>
              <li>Click the button below to open Pastebin in a new tab</li>
              <li>Copy your code from the editor</li>
              <li>Paste it into Pastebin</li>
              <li>Click "Create New Paste"</li>
              <li>Copy the URL and share it with others</li>
            </ol>
            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "20px" }}>
              <button
                onClick={() => window.open("https://pastebin.com/", "_blank")}
                style={{
                  padding: "8px 12px",
                  backgroundColor: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Open Pastebin
              </button>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  padding: "8px 12px",
                  backgroundColor: "#dc3545",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}