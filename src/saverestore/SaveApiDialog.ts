export function showApiDialogSave(api: any) {
  const blob = new Blob([JSON.stringify(api, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'api-spec.json';
  a.click();
  URL.revokeObjectURL(url);
} 