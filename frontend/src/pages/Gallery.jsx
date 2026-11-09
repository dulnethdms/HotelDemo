import { useState } from 'react';
import Seo from '../components/Seo';
import Lightbox from '../components/Lightbox';
import SmartImg from '../components/SmartImg';
import { PageHeader, Loader } from '../components/Ui';
import useApi from '../hooks/useApi';

const CATS = [['all', 'All'], ['rooms', 'Rooms'], ['beach', 'Beach'], ['pool', 'Swimming Pool'], ['restaurant', 'Restaurant'], ['activities', 'Activities']];

export default function Gallery() {
  const { data, loading } = useApi('/gallery');
  const [cat, setCat] = useState('all');
  const [open, setOpen] = useState(null);
  const items = cat === 'all' ? data : data.filter((g) => g.category === cat);

  return (
    <>
      <Seo title="Gallery" description="Photos of our rooms, private beach, swimming pool, restaurant and resort activities." />
      <PageHeader title="Gallery" subtitle="A glimpse of life at Ocean Paradise" />
      <section className="section">
        <div className="container">
          <div className="filters" role="tablist">
            {CATS.map(([k, l]) => (
              <button key={k} role="tab" aria-selected={cat === k} className={cat === k ? 'active' : ''} onClick={() => setCat(k)}>{l}</button>
            ))}
          </div>
          {loading ? <Loader /> : items.length === 0 ? <p className="center muted">No photos in this category yet.</p> : (
            <div className="masonry">
              {items.map((g, i) => (
                <button key={g.id} className="masonry__item" onClick={() => setOpen(i)} aria-label={`Open ${g.title}`}>
                  <SmartImg src={g.image_url} alt={g.title} />
                  <span>{g.title}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>
      {open !== null && <Lightbox items={items} index={open} onClose={() => setOpen(null)} onChange={setOpen} />}
    </>
  );
}
