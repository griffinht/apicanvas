export function NewProject() {
  const handleNewProject = () => {
    const template = {
        "openapi": "3.0.0",
        "info": {
            "title": "New API",
            "version": "1.0.0"
        },
        "paths": {
            "/hello": {
                "get": {
                    "summary": "get /hello",
                    "responses": {
                        "200": {
                            "description": "Successful response",
                            "content": {
                                "application/json": {
                                    "schema": {
                                        "type": "object",
                                        "properties": {
                                            "message": {
                                                "type": "string",
                                                "example": "Hello World!"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    };
    (window as any).editor?.setValue(JSON.stringify(template, null, 4));
  };

  return (
    <button
      onClick={handleNewProject}
      style={{
        padding: '8px 12px',
        margin: '4px 0',
        backgroundColor: 'transparent',
        border: '1px solid #ccc',
        borderRadius: '4px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '4px'
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
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
      New Project
    </button>
  );
}