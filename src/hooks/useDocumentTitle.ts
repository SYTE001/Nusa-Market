import { useEffect } from 'react';

/**
 * Sets the document title for the routed page and restores it on unmount.
 */
export function useDocumentTitle(title: string) {
  useEffect(() => {
    const previous = document.title;
    document.title = title;
    return () => {
      document.title = previous;
    };
  }, [title]);
}
