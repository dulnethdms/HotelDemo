import { useEffect } from 'react';
import { useContent } from '../context/ContentContext';

// Sets <title> and meta description per page (SEO)
export default function Seo({ title, description }) {
  const { text } = useContent();
  const name = text('hotel_name', 'Sample Hotel');
  useEffect(() => {
    document.title = title ? `${title} | ${name}` : `${name} | Luxury Beachfront Hotel`;
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) { meta = document.createElement('meta'); meta.name = 'description'; document.head.appendChild(meta); }
    if (description) meta.content = description;
  }, [title, description, name]);
  return null;
}
