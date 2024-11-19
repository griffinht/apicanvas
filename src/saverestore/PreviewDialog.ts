export function showApiPreviewDialog(api: any) {
  const previewWindow = window.open('', '_blank');
  if (previewWindow) {
    previewWindow.document.write(`
      <html>
        <head>
          <title>API Preview</title>
          <style>
            pre { padding: 20px; white-space: pre-wrap; }
          </style>
        </head>
        <body>
          <pre>${JSON.stringify(api, null, 2)}</pre>
        </body>
      </html>
    `);
  }
} 