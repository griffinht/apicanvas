/**
 * SampleLoader.ts
 * Handles loading sample API specifications for first-time visitors
 */

/**
 * Loads a sample API specification for first-time visitors
 * @returns Promise that resolves to true if the sample was loaded successfully
 */
export async function loadSampleApi(): Promise<boolean> {
  try {
    const response = await fetch('/openapi.yaml');
    if (!response.ok) {
      throw new Error('Failed to fetch sample API');
    }
    const sampleApi = await response.text();
    const editor = (window as any).editor;
    if (editor) {
      editor.setValue(sampleApi);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error loading sample API:', error);
    throw error;
  }
}

/**
 * Custom hook to handle first-time visitor experience
 * Checks if the user has visited before and loads a sample API if not
 */
export function checkAndLoadSampleForFirstTimeVisitor(editorMounted: boolean): Promise<boolean> {
  if (!editorMounted) return Promise.resolve(false);
  
  const hasVisitedBefore = localStorage.getItem('hasVisitedBefore');
  if (!hasVisitedBefore) {
    localStorage.setItem('hasVisitedBefore', 'true');
    return loadSampleApi();
  }
  
  return Promise.resolve(false);
} 