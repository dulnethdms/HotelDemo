import Reveal from './Reveal';

export function SectionTitle({ eyebrow, title, text, center = true }) {
  return (
    <Reveal className={`section-title ${center ? 'section-title--center' : ''}`}>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2>{title}</h2>
      {text && <p>{text}</p>}
    </Reveal>
  );
}

export function PageHeader({ title, subtitle, image }) {
  return (
    <section className="page-header" style={image ? { '--bg': `url(${image})` } : undefined}>
      <div className="container">
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
    </section>
  );
}

export const Loader = () => <div className="loader" role="status" aria-label="Loading"><span /><span /><span /></div>;
