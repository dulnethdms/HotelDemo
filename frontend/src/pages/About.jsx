import Seo from '../components/Seo';
import Reveal from '../components/Reveal';
import SmartImg from '../components/SmartImg';
import { PageHeader, SectionTitle } from '../components/Ui';
import { useContent } from '../context/ContentContext';

export default function About() {
  const { text, json } = useContent();
  return (
    <>
      <Seo title="About Us" description="The story, mission and vision behind Ocean Paradise Resort, and why guests choose us." />
      <PageHeader title="About Us" subtitle="Barefoot luxury, heartfelt hospitality" />

      <section className="section">
        <div className="container split">
          <Reveal className="split__media"><SmartImg src={text('about_image')} alt="Our beach" /></Reveal>
          <Reveal className="split__text" delay={120}>
            <span className="eyebrow">Since 2009</span>
            <h2>{text('story_title', 'Our Story')}</h2>
            <p>{text('story_text')}</p>
          </Reveal>
        </div>
      </section>

      <section className="section section--foam">
        <div className="container grid grid--2">
          <Reveal className="mv"><h3>Our Mission</h3><p>{text('mission')}</p></Reveal>
          <Reveal className="mv" delay={120}><h3>Our Vision</h3><p>{text('vision')}</p></Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionTitle eyebrow="Why Choose Us" title="The Ocean Paradise difference" />
          <div className="grid grid--4">
            {json('why_choose').map((w, i) => (
              <Reveal key={w.title} className="why" delay={i * 80}>
                <span className="why__num">{String(i + 1).padStart(2, '0')}</span>
                <h3>{w.title}</h3>
                <p>{w.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--navy">
        <div className="container">
          <SectionTitle eyebrow="Facilities & Amenities" title="Everything for a perfect stay" light />
          <div className="grid grid--4">
            {json('facilities').map((f, i) => (
              <Reveal key={f.title} className="amenity" delay={i * 60}>
                <span aria-hidden="true">{f.icon}</span>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
