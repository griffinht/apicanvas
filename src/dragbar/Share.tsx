import { Share2 as ShareIcon } from "lucide-react";

export function Share() {
  return (
    <a
      href="https://github.com/griffinht/oas2tree2/issues/13"
      target="_blank"
      rel="noopener noreferrer"
      style={{
        padding: '8px 12px',
        margin: '4px 0',
        backgroundColor: 'transparent',
        border: '1px solid #ccc',
        borderRadius: '4px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        textDecoration: 'none',
        color: 'inherit'
      }}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
        <polyline points="16 6 12 2 8 6" />
        <line x1="12" y1="2" x2="12" y2="15" />
      </svg>
      <ShareIcon size={18} /> Share
    </a>
  );
}