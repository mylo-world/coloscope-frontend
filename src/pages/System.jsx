import { Link } from '../router'
import { PageHero, Section, Callout } from '../components/Layout'

export default function System({ c }) {
  const s = c.system
  return (
    <>
      <PageHero eyebrow={s.eyebrow} title={s.title} lead={s.lead} />

      <Section title={s.journeyTitle}>
        <ol className="timeline">
          {s.journey.map((j, i) => (
            <li key={j.t}>
              <span className="timeline-n">{i + 1}</span>
              <div>
                <h3>{j.t}</h3>
                <p>{j.d}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section alt title={s.partsTitle}>
        <div className="tiers">
          {s.parts.map((p, i) => (
            <div key={p.t} className="tier-wrap">
              <div className="tier">
                <p className="tier-tech">{p.tech}</p>
                <h3>{p.t}</h3>
                <p>{p.d}</p>
              </div>
              {i < s.flow.length && <div className="tier-arrow"><span>{s.flow[i]}</span></div>}
            </div>
          ))}
        </div>
        <div style={{ marginTop: 24 }}>
          <Callout title={s.privacyTitle} tone="ok">{s.privacyBody}</Callout>
        </div>
      </Section>

      <Section title={s.outputTitle}>
        <div className="defs">
          {s.output.map((o) => (
            <div key={o.k} className="def">
              <p className="def-k">{o.k}</p>
              <p className="def-v">{o.v}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section alt title={s.stackTitle}>
        <div className="chips">
          {s.stack.map((x) => <span key={x} className="chip chip-plain">{x}</span>)}
        </div>
        <div className="grid-2" style={{ marginTop: 24 }}>
          <div className="tile">
            <h3>{s.hardwareTitle}</h3>
            <p>{s.hardwareBody}</p>
          </div>
          <div className="tile">
            <h3>{s.responsibleTitle}</h3>
            <p>{s.responsibleBody}</p>
          </div>
        </div>
      </Section>

      <Section>
        <div className="cta-band">
          <div>
            <h2>{s.ctaTitle}</h2>
            <p>{s.ctaBody}</p>
          </div>
          <Link to="/demo" className="btn btn-primary btn-lg">{s.cta}</Link>
        </div>
      </Section>
    </>
  )
}
