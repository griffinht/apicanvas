interface ApiInfoBarProps {
  title: string;
  setTitle: (title: string) => void;
  version: string;
  setVersion: (version: string) => void;
  direction: 'TB' | 'LR';
  setDirection: (direction: 'TB' | 'LR') => void;
}

export function ApiInfoBar({ title, setTitle, version, setVersion, direction, setDirection }: ApiInfoBarProps) {
  return (
    <div className="api-info" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value || 'Untitled API')}
        style={{ fontSize: 'inherit', fontWeight: 'bold' }}
        placeholder="API Title"
      />
      {' - v'}
      <input
        type="text"
        value={version}
        onChange={(e) => setVersion(e.target.value || '0.0.1')}
        style={{ fontSize: 'inherit', width: '60px' }}
        placeholder="0.0.1"
      />
      <button onClick={() => setDirection(direction === 'TB' ? 'LR' : 'TB')}>
        {direction === 'TB' ? 'Switch to horizontal' : 'Switch to vertical'}
      </button>
    </div>
  );
} 