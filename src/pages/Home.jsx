import { Link } from '../router'
import { HeroIllustration } from '../components/Illustrations'
import { Section, Callout } from '../components/Layout'

export default function Home({ c }) {
  const h = c.home
  return (
    <>
      <section className="container landing-hero">
        <div>
          <p className="eyebrow">{h.eyebrow}</p>
          <h1>{h.title}</h1>
          <p className="lead">{h.lead}</p>
          <div className="cta-row">
            <Link to="/demo" className="btn btn-primary btn-lg">{h.ctaPrimary}</Link>
            <Link to="/sva" className="btn btn-secondary btn-lg">{h.ctaSecondary}</Link>
          </div>
        </div>
        <HeroIllustration labels={h.illus} alt={h.illus.alt} caption={h.illus.caption} />
      </section>

      <div className="container">
        <div className="stat-strip">
          {h.numbers.map((n) => (
            <div key={n.l}>
              <div className="stat-value">{n.v}</div>
              <div className="stat-label">{n.l}</div>
            </div>
          ))}
        </div>
      </div>

      <Section title={h.problemTitle}>
        <div className="grid-3">
          {h.problem.map((p, i) => (
            <div key={p.t} className="tile">
              <span className="tile-n">{String(i + 1).padStart(2, '0')}</span>
              <h3>{p.t}</h3>
              <p>{p.d}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section alt title={h.approachTitle}>
        <div className="grid-2">
          {h.approach.map((p, i) => (
            <div key={p.t} className="tile">
              <span className="tile-n">{String(i + 1).padStart(2, '0')}</span>
              <h3>{p.t}</h3>
              <p>{p.d}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title={h.exploreTitle}>
        <div className="grid-3">
          {h.explore.map((e) => (
            <Link key={e.to} to={e.to} className="tile link">
              <h3>{e.t}</h3>
              <p>{e.d}</p>
              <span className="tile-cta">{e.cta} &rarr;</span>
            </Link>
          ))}
        </div>
      </Section>

      <Section>
        <Callout>{h.notice}</Callout>
      </Section>
    </>
  )
}
