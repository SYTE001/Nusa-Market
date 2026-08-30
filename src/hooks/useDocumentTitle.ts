import { useEffect } from 'react';

/**
 * Gives a route its own browser-tab title and puts the previous one back when
 * the page unmounts, so the title always belongs to the page currently on
 * screen - including after a browser Back.
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
