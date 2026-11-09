import { useEffect, useState } from 'react';
import { api } from '../api';

// Fetch a public endpoint once; returns { data, loading, error }
export default function useApi(path, initial = []) {
  const [state, setState] = useState({ data: initial, loading: true, error: null });
  useEffect(() => {
    let alive = true;
    setState((s) => ({ ...s, loading: true }));
    api.get(path)
      .then((data) => alive && setState({ data, loading: false, error: null }))
      .catch((e) => alive && setState({ data: initial, loading: false, error: e.message }));
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path]);
  return state;
}
