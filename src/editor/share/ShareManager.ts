/**
 * ShareManager.ts
 * Handles the loading of shared API specifications
 */
import { useState, useEffect } from 'react';
import { checkAndLoadSampleForFirstTimeVisitor } from '../FirstTimeSampleLoader';

/**
 * Checks if the current URL contains a share ID and loads the corresponding API spec
 * @returns Promise that resolves to true if a shared spec was loaded, false otherwise
 */
export async function checkAndLoadSharedSpec(): Promise<boolean> {
  const urlParams = new URLSearchParams(window.location.search);
  const shareId = urlParams.get('share');
  
  if (!shareId) {
    return false;
  }
  
  try {
    // In a real implementation, this would make an API call to fetch the spec
    // For now, we'll simulate a successful response with mock data
    console.log(`Loading shared spec with ID: ${shareId}`);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock response - in real implementation, this would come from your backend
    const mockApiSpec = `openapi: 3.0.0
info:
  title: Shared API Example
  version: 1.0.0
  description: This is a shared API specification example
paths:
  /users:
    get:
      summary: Get all users
      responses:
        '200':
          description: A list of users
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/User'
    post:
      summary: Create a user
      responses:
        '201':
          description: User created
components:
  schemas:
    User:
      type: object
      properties:
        id:
          type: integer
        name:
          type: string`;
    
    // Set the editor value to the loaded spec
    const editor = (window as any).editor;
    if (editor) {
      editor.setValue(mockApiSpec);
      
      // Remove the share parameter from URL to avoid reloading on refresh
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
      
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error loading shared spec:', error);
    return false;
  }
}

/**
 * Custom hook to handle shared spec loading and first-time visitor experience
 * This encapsulates all the share-related functionality that was previously in App.tsx
 */
export function useSharedSpecLoader(editorMounted: boolean) {
  const [isLoadingSharedSpec, setIsLoadingSharedSpec] = useState(false);
  const [sharedSpecError, setSharedSpecError] = useState<string | null>(null);

  // Check for shared spec in URL or load sample for first-time visitors
  useEffect(() => {
    if (!editorMounted) return;

    const loadSpecOrSample = async () => {
      setIsLoadingSharedSpec(true);
      setSharedSpecError(null);
      
      try {
        // First check if there's a shared spec to load
        const wasSharedSpecLoaded = await checkAndLoadSharedSpec();
        
        // If no shared spec was loaded, check if we should load a sample
        if (!wasSharedSpecLoaded) {
          await checkAndLoadSampleForFirstTimeVisitor(editorMounted);
        }
      } catch (error) {
        console.error('Error loading spec:', error);
        setSharedSpecError('Failed to load the API specification. Please try again later.');
      } finally {
        setIsLoadingSharedSpec(false);
      }
    };
    
    loadSpecOrSample();
  }, [editorMounted]);

  return {
    isLoadingSharedSpec,
    sharedSpecError
  };
} 