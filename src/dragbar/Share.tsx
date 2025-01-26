import { useState } from 'react';

export function Share() {
  const [showModal, setShowModal] = useState(false);

  const handleShare = async () => {
    const editorContent = (window as any).editor?.getValue();
    if (!editorContent) {
      alert('No content to share');
      return;
    }
    setShowModal(true);
  };

  return (
    <>
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleShare();
        }}
        style={{ margin: '12px 0', width: '70px' }}
      >
        share
      </button>

      {showModal && (
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
            zIndex: 1000,
          }}
          onClick={() => setShowModal(false)}
        >
          <div 
            style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '8px',
              maxWidth: '500px',
              color: 'black',
            }}
            onClick={e => e.stopPropagation()}
          >
            <h3>How to Share Your Code</h3>
            <ol>
              <li>Click the button below to open Pastebin in a new tab</li>
              <li>Copy your code from the editor</li>
              <li>Paste it into Pastebin</li>
              <li>Click "Create New Paste"</li>
              <li>Copy the URL and share it with others</li>
            </ol>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button onClick={() => window.open('https://pastebin.com/', '_blank')}>
                Open Pastebin
              </button>
              <button onClick={() => setShowModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 