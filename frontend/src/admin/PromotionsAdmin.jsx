import CrudManager from './CrudManager';

export default function PromotionsAdmin() {
  return (
    <CrudManager
      title="Promotions"
      noun="Promotion"
      listPath="/promotions/admin/all"
      basePath="/promotions"
      empty={{ title: '', category: 'seasonal', description: '', discount_label: '', image_url: '', valid_from: '', valid_until: '', is_active: true }}
      fields={[
        { name: 'title', label: 'Title', wide: true },
        { name: 'category', label: 'Type', type: 'select', options: [['seasonal', 'Seasonal'], ['holiday', 'Holiday discount'], ['event', 'Special event']] },
        { name: 'discount_label', label: 'Badge text', hint: 'e.g. 20% OFF' },
        { name: 'description', label: 'Description', type: 'textarea', wide: true },
        { name: 'image_url', label: 'Banner image', type: 'image', wide: true },
        { name: 'valid_from', label: 'Valid from', type: 'date' },
        { name: 'valid_until', label: 'Valid until', type: 'date', hint: 'expired offers hide automatically' },
        { name: 'is_active', label: 'Visible on the website', type: 'checkbox' },
      ]}
      columns={[
        { key: 'image_url', label: 'Banner', type: 'image' },
        { key: 'title', label: 'Title' },
        { key: 'category', label: 'Type' },
        { key: 'valid_until', label: 'Ends', render: (p) => p.valid_until || '—' },
        { key: 'is_active', label: 'Status', render: (p) => <span className={`pill ${p.is_active ? 'pill--on' : ''}`}>{p.is_active ? 'Active' : 'Hidden'}</span> },
      ]}
    />
  );
}
