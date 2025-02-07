import { CirclePlus as CreateIcon } from 'lucide-react';
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
      id="new-project"
      onClick={handleNewProject}
    >
      <CreateIcon size={14} />
      <br />
      New Project
    </button>
  );
}