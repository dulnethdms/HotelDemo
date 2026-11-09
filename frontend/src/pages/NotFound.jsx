import { Link } from 'react-router-dom';
import Seo from '../components/Seo';

export default function NotFound() {
  return (
    <section className="section center" style={{ paddingTop: '10rem' }}>
      <Seo title="Page not found" />
      <h1>Lost at sea?</h1>
      <p className="muted">We could not find that page.</p>
      <Link to="/" className="btn btn--gold mt">Back to home</Link>
    </section>
  );
}
