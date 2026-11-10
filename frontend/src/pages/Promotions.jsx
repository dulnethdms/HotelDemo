import { useState } from 'react';
import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import PromoCard from '../components/PromoCard';
import { PageHeader, Loader } from '../components/Ui';
import useApi from '../hooks/useApi';

const TABS = [['all', 'All Offers'], ['seasonal', 'Seasonal'], ['holiday', 'Holiday'], ['event', 'Special Events']];

export default function Promotions() {
  const { data, loading } = useApi('/promotions');
  const [tab, setTab] = useState('all');
  const list = tab === 'all' ? data : data.filter((p) => p.category === tab);

  return (
    <>
      <Seo title="Promotions" description="Seasonal promotions, holiday discounts and special event packages at Mora Mila Hotel." />
      <PageHeader title="Promotions" subtitle="Seasonal offers, holiday discounts & special events" />
      <section className="section">
        <div className="container">
          <div className="filters" role="tablist">
            {TABS.map(([k, l]) => (
              <button key={k} role="tab" aria-selected={tab === k} className={tab === k ? 'active' : ''} onClick={() => setTab(k)}>{l}</button>
            ))}
          </div>
          {loading ? <Loader /> : list.length === 0 ? <p className="center muted">No offers in this category right now. Please check back soon.</p> : (
            <div className="stack">{list.map((p) => <PromoCard key={p.id} promo={p} banner />)}</div>
          )}
          <p className="center muted mt">To take advantage of an offer, <Link to="/contact" className="link">get in touch</Link> and mention the promotion name.</p>
        </div>
      </section>
    </>
  );
}
