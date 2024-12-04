interface ApiInfoBarProps {
  title: string;
  setTitle: (title: string) => void;
  version: string;
  setVersion: (version: string) => void;
}

export function ApiInfoBar({ title, setTitle, version, setVersion }: ApiInfoBarProps) {
  return (
    <div className="api-info">
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
    </div>
  );
} 