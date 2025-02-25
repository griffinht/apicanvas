import { Share2 as ShareIcon } from "lucide-react";
import { useState } from "react";

export function Share() {
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleShare = async () => {
    // Reset states
    setErrorMessage("");
    
    // Get the editor content
    const editorContent = (window as unknown as { editor?: { getValue: () => string } }).editor?.getValue();
    if (!editorContent) {
      alert("No content to share");
      return;
    }

    setShowShareDialog(true);
    setIsGeneratingLink(true);
    
    try {
      // Simulate API call to backend
      // In a real implementation, this would be an actual API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock response - in real implementation, this would come from your backend
      const mockShareId = "share_" + Math.random().toString(36).substring(2, 10);
      const baseUrl = window.location.origin;
      setShareLink(`${baseUrl}?share=${mockShareId}`);
    } catch (error) {
      console.error("Error generating share link:", error);
      setErrorMessage("Failed to generate share link. Please try again later.");
    } finally {
      setIsGeneratingLink(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink)
      .then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
        setErrorMessage("Failed to copy to clipboard. Please copy the link manually.");
      });
  };

  return (
    <>
      <button
        id="share"
        onClick={(e) => {
          e.stopPropagation();
          handleShare();
        }}
        aria-label="Share API Specification"
        data-tooltip="Share API Specification"
      >
        <ShareIcon size={18} />
      </button>

      {showShareDialog && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
          }}
          onClick={() => setShowShareDialog(false)}
        >
          <div
            style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '8px',
              width: '90%',
              maxWidth: '500px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ marginTop: 0, marginBottom: '16px' }}>Share API Specification</h3>
            
            {isGeneratingLink ? (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <div style={{ 
                  border: '4px solid #f3f3f3',
                  borderTop: '4px solid #6BA539',
                  borderRadius: '50%',
                  width: '30px',
                  height: '30px',
                  animation: 'spin 2s linear infinite',
                  margin: '0 auto 15px auto'
                }} />
                <p>Generating share link...</p>
                <style>
                  {`
                    @keyframes spin {
                      0% { transform: rotate(0deg); }
                      100% { transform: rotate(360deg); }
                    }
                  `}
                </style>
              </div>
            ) : (
              <>
                {errorMessage ? (
                  <div style={{ 
                    color: 'red', 
                    backgroundColor: '#ffeeee', 
                    padding: '10px', 
                    borderRadius: '4px',
                    marginBottom: '16px'
                  }}>
                    {errorMessage}
                  </div>
                ) : (
                  <>
                    <p style={{ marginBottom: '12px' }}>
                      Share this link with others to let them view your API specification:
                    </p>
                    <div style={{ 
                      display: 'flex',
                      marginBottom: '16px'
                    }}>
                      <input
                        type="text"
                        value={shareLink}
                        readOnly
                        style={{
                          flex: 1,
                          padding: '8px 12px',
                          border: '1px solid #ccc',
                          borderRadius: '4px',
                          marginRight: '8px'
                        }}
                      />
                      <button
                        onClick={handleCopyLink}
                        style={{
                          padding: '8px 12px',
                          backgroundColor: copySuccess ? '#4CAF50' : '#6BA539',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        {copySuccess ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                    <div style={{ 
                      backgroundColor: '#f8f9fa', 
                      padding: '10px', 
                      borderRadius: '4px',
                      marginBottom: '16px',
                      fontSize: '0.9rem'
                    }}>
                      <p style={{ margin: '0 0 8px 0', fontWeight: 'bold' }}>How sharing works:</p>
                      <ol style={{ margin: '0', paddingLeft: '20px' }}>
                        <li>This link contains a unique ID for your API spec</li>
                        <li>When someone opens the link, the app will load your shared spec</li>
                        <li>Currently this is a mock implementation - the link will expire when you refresh</li>
                      </ol>
                    </div>
                  </>
                )}
              </>
            )}
            
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowShareDialog(false)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#f0f0f0',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
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