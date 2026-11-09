import CrudManager from './CrudManager';

const badge = (on) => <span className={`pill ${on ? 'pill--on' : ''}`}>{on ? 'Active' : 'Hidden'}</span>;

export default function PackagesAdmin() {
  return (
    <CrudManager
      title="Rooms & Packages"
      noun="Package"
      listPath="/packages/admin/all"
      basePath="/packages"
      empty={{ name: '', category: 'room', description: '', price: '', price_note: 'per night', image_url: '', features: '', special_offer: '', is_featured: false, is_active: true, sort_order: 0 }}
      fields={[
        { name: 'name', label: 'Name', wide: true },
        { name: 'category', label: 'Type', type: 'select', options: [['room', 'Room'], ['package', 'Package']] },
        { name: 'sort_order', label: 'Display order', type: 'number', hint: 'lower shows first' },
        { name: 'description', label: 'Description', type: 'textarea', wide: true },
        { name: 'price', label: 'Starting price', type: 'number' },
        { name: 'price_note', label: 'Price note', hint: 'e.g. per night' },
        { name: 'image_url', label: 'Image', type: 'image', wide: true },
        { name: 'features', label: 'Included facilities', type: 'lines', hint: 'one per line', wide: true },
        { name: 'special_offer', label: 'Special offer', hint: 'optional ribbon text', wide: true },
        { name: 'is_featured', label: 'Feature on the home page', type: 'checkbox' },
        { name: 'is_active', label: 'Visible on the website', type: 'checkbox' },
      ]}
      columns={[
        { key: 'image_url', label: 'Image', type: 'image' },
        { key: 'name', label: 'Name' },
        { key: 'category', label: 'Type' },
        { key: 'price', label: 'Price', render: (p) => Number(p.price).toLocaleString() },
        { key: 'is_featured', label: 'Featured', render: (p) => (p.is_featured ? '★' : '') },
        { key: 'is_active', label: 'Status', render: (p) => badge(p.is_active) },
      ]}
    />
  );
}
