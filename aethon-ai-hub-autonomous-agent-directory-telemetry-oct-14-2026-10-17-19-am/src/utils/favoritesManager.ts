import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'aethon_favorite_agents';
const EVENT_NAME = 'aethon_favorites_updated';

// Default initial favorites for first-time visitors
const DEFAULT_FAVORITES: string[] = ['nexus-core', 'codex-titan'];

export const getFavoriteAgentIds = (): string[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Seed default favorites on first visit
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_FAVORITES));
      return DEFAULT_FAVORITES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : DEFAULT_FAVORITES;
  } catch {
    return DEFAULT_FAVORITES;
  }
};

export const setFavoriteAgentIds = (ids: string[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: ids }));
  } catch {
    // Ignore storage quota errors
  }
};

export const isFavoriteAgent = (id: string): boolean => {
  const list = getFavoriteAgentIds();
  return list.includes(id);
};

export const toggleFavoriteAgent = (id: string): boolean => {
  const current = getFavoriteAgentIds();
  const exists = current.includes(id);
  const next = exists ? current.filter((item) => item !== id) : [...current, id];
  setFavoriteAgentIds(next);
  return !exists;
};

export const addFavoriteAgent = (id: string): void => {
  const current = getFavoriteAgentIds();
  if (!current.includes(id)) {
    setFavoriteAgentIds([...current, id]);
  }
};

export const removeFavoriteAgent = (id: string): void => {
  const current = getFavoriteAgentIds();
  if (current.includes(id)) {
    setFavoriteAgentIds(current.filter((item) => item !== id));
  }
};

/**
 * React Hook for listening and synchronizing favorite agents across all components
 */
export const useFavoriteAgents = () => {
  const [favoriteIds, setFavorites] = useState<string[]>(() => getFavoriteAgentIds());

  useEffect(() => {
    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<string[]>;
      if (customEvent.detail && Array.isArray(customEvent.detail)) {
        setFavorites(customEvent.detail);
      } else {
        setFavorites(getFavoriteAgentIds());
      }
    };

    window.addEventListener(EVENT_NAME, handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener(EVENT_NAME, handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const isFavorite = useCallback(
    (id: string) => favoriteIds.includes(id),
    [favoriteIds]
  );

  const toggle = useCallback((id: string) => {
    return toggleFavoriteAgent(id);
  }, []);

  const add = useCallback((id: string) => {
    addFavoriteAgent(id);
  }, []);

  const remove = useCallback((id: string) => {
    removeFavoriteAgent(id);
  }, []);

  return {
    favoriteIds,
    isFavorite,
    toggleFavorite: toggle,
    addFavorite: add,
    removeFavorite: remove,
  };
};
