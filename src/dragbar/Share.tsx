export function Share() {
  const handleShare = async () => {
    const editorContent = (window as any).editor?.getValue();
    if (!editorContent) {
      alert('No content to share');
      return;
    }

    // Open Pastebin in a new tab
    window.open('https://pastebin.com/', '_blank');
  };

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        handleShare();
      }}
      style={{ margin: '12px 0', width: '70px' }}
    >
      share
    </button>
  );
} 