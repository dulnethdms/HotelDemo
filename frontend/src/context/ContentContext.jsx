import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { api } from '../api';

const Ctx = createContext(null);

export function ContentProvider({ children }) {
  const [content, setContent] = useState({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    api.get('/content').then(setContent).catch(() => {}).finally(() => setLoaded(true));
  }, []);

  const text = useCallback((key, fallback = '') => content[key] || fallback, [content]);
  const json = useCallback(
    (key, fallback = []) => {
      try { return content[key] ? JSON.parse(content[key]) : fallback; } catch { return fallback; }
    },
    [content]
  );

  return <Ctx.Provider value={{ content, loaded, text, json }}>{children}</Ctx.Provider>;
}

export const useContent = () => useContext(Ctx);
