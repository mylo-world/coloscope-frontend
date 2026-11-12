export function PageHero({ eyebrow, title, lead, children }) {
  return (
    <header className="page-hero">
      <div className="container">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1>{title}</h1>
        {lead && <p className="lead">{lead}</p>}
        {children}
      </div>
    </header>
  )
}

export function Section({ id, title, lead, alt, children }) {
  return (
    <section id={id} className={`sec${alt ? ' alt' : ''}`}>
      <div className="container">
        {(title || lead) && (
          <div className="sec-head">
            {title && <h2>{title}</h2>}
            {lead && <p className="sec-lead">{lead}</p>}
          </div>
        )}
        {children}
      </div>
    </section>
  )
}

export function Callout({ title, children, tone = 'info' }) {
  return (
    <div className={`callout callout-${tone}`}>
      {title && <p className="callout-title">{title}</p>}
      <div className="callout-body">{children}</div>
    </div>
  )
}

// In-page navigation. Uses scrollIntoView because the hash is taken by the router.
export function ScrollNav({ label, items }) {
  const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  return (
    <nav className="toc" aria-label={label}>
      <span className="toc-label">{label}</span>
      {items.map(([id, text]) => (
        <button key={id} onClick={() => go(id)}>{text}</button>
      ))}
    </nav>
  )
}
