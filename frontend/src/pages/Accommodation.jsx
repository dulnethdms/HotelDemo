import { useState } from 'react';
import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import PackageCard from '../components/PackageCard';
import { PageHeader, Loader } from '../components/Ui';
import useApi from '../hooks/useApi';

const TABS = [['all', 'All'], ['room', 'Rooms'], ['package', 'Packages']];

export default function Accommodation() {
  const { data, loading, error } = useApi('/packages');
  const [tab, setTab] = useState('all');
  const list = tab === 'all' ? data : data.filter((p) => p.category === tab);

  return (
    <>
      <Seo title="Accommodation & Packages" description="Ocean-view rooms, honeymoon, family and luxury villa packages at Sample Hotel." />
      <PageHeader title="Accommodation & Packages" subtitle="Rooms, suites and curated experiences by the sea" />
      <section className="section">
        <div className="container">
          <div className="filters" role="tablist">
            {TABS.map(([k, l]) => (
              <button key={k} role="tab" aria-selected={tab === k} className={tab === k ? 'active' : ''} onClick={() => setTab(k)}>{l}</button>
            ))}
          </div>
          {loading ? <Loader /> : error ? <p className="center muted">{error}</p> : (
            <div className="grid grid--3">{list.map((p, i) => <PackageCard key={p.id} pkg={p} delay={(i % 3) * 80} />)}</div>
          )}
          <p className="center muted mt">Prices are indicative and may vary by season. <Link to="/contact" className="link">Contact us</Link> for availability and the best current rates.</p>
        </div>
      </section>
    </>
  );
}
