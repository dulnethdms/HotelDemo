import { useState } from 'react';
import { assetUrl } from '../api';

// <img> that falls back to an ocean-gradient block if the image fails to load
export default function SmartImg({ src, alt = '', className = '', ...rest }) {
  const [bad, setBad] = useState(false);
  if (bad || !src) return <div className={`img-fallback ${className}`} role="img" aria-label={alt} />;
  return <img src={assetUrl(src)} alt={alt} loading="lazy" className={className} onError={() => setBad(true)} {...rest} />;
}
