const BLOB =
  'M392 178 C398 152 432 142 452 158 C474 176 472 214 448 230 C424 246 388 232 384 206 C382 194 386 184 392 178 Z'

const std = (arr) => {
  const m = arr.reduce((a, b) => a + b, 0) / arr.length
  return Math.sqrt(arr.reduce((a, b) => a + (b - m) ** 2, 0) / arr.length)
}

/* Landing: three phrasings pointing at one highlighted lesion. */
export function HeroIllustration({ labels, alt, caption }) {
  const chips = [
    { y: 62, text: 'polyp' },
    { y: 154, text: 'mucosal protrusion' },
    { y: 246, text: 'sessile lesion' },
  ]
  return (
    <figure className="illus">
      <svg viewBox="0 0 560 350" role="img" aria-label={alt}>
        <defs>
          <radialGradient id="hero-mucosa" cx="45%" cy="50%" r="75%">
            <stop offset="0%" stopColor="#c9776b" />
            <stop offset="60%" stopColor="#a8554b" />
            <stop offset="100%" stopColor="#5c2a27" />
          </radialGradient>
          <clipPath id="hero-frame"><rect x="300" y="34" width="240" height="290" rx="16" /></clipPath>
          <marker id="hero-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M1 1 L8 5 L1 9" fill="none" stroke="#14b8a6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </marker>
        </defs>

        <text x="20" y="22" className="illus-cap">{labels.left}</text>
        <text x="300" y="22" className="illus-cap">{labels.right}</text>

        <g clipPath="url(#hero-frame)">
          <rect x="300" y="34" width="240" height="290" fill="url(#hero-mucosa)" />
          <ellipse cx="352" cy="96" rx="48" ry="36" fill="#2a0f10" opacity="0.75" />
          <path d={BLOB} fill="#e8a79c" />
          <path d={BLOB} fill="#2f9e5b" fillOpacity="0.55" stroke="#ff8c00" strokeWidth="3" />
        </g>

        {chips.map((c) => (
          <g key={c.text}>
            <path
              d={`M230 ${c.y + 22} C290 ${c.y + 22} 330 200 384 200`}
              fill="none" stroke="#14b8a6" strokeWidth="1.8" strokeDasharray="5 4" markerEnd="url(#hero-arrow)"
            />
            <rect x="20" y={c.y} width="210" height="44" rx="22" fill="#fff" stroke="#cdd6df" />
            <text x="125" y={c.y + 27} textAnchor="middle" className="illus-chip">{c.text}</text>
          </g>
        ))}
      </svg>
      <figcaption>{caption}</figcaption>
    </figure>
  )
}

/* SVA page: inconsistent versus consistent output (conceptual). */
export function ConceptCompare({ c }) {
  const phrases = ['polyp', 'mucosal protrusion', 'sessile lesion']
  const panels = [
    { ox: 0, title: c.without.title, cap: c.without.cap, bg: '#f6f8fa', shapes: [
      { dx: 0, dy: 0, rx: 26, ry: 14 }, { dx: -17, dy: 5, rx: 12, ry: 9 }, { dx: 15, dy: -3, rx: 20, ry: 17 } ] },
    { ox: 320, title: c.with.title, cap: c.with.cap, bg: '#ecf7f6', shapes: [
      { dx: 0, dy: 0, rx: 24, ry: 14 }, { dx: 0, dy: 0, rx: 24, ry: 14 }, { dx: 0, dy: 0, rx: 24, ry: 14 } ] },
  ]
  return (
    <figure className="illus">
      <svg viewBox="0 0 600 250" role="img" aria-label={`${c.without.title}: ${c.without.cap}. ${c.with.title}: ${c.with.cap}.`}>
        <defs>
          <marker id="cc-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M1 1 L8 5 L1 9" fill="none" stroke="#8798aa" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </marker>
        </defs>
        {panels.map((p) => (
          <g key={p.ox}>
            <rect x={p.ox} y="0" width="280" height="250" rx="12" fill={p.bg} stroke="#e3e8ee" />
            <text x={p.ox + 16} y="28" className="illus-title">{p.title}</text>
            {phrases.map((ph, r) => {
              const y = 52 + r * 58
              const s = p.shapes[r]
              return (
                <g key={ph}>
                  <rect x={p.ox + 16} y={y} width="126" height="34" rx="17" fill="#fff" stroke="#cdd6df" />
                  <text x={p.ox + 79} y={y + 21} textAnchor="middle" className="illus-chip small">{ph}</text>
                  <line x1={p.ox + 146} y1={y + 17} x2={p.ox + 172} y2={y + 17} stroke="#8798aa" strokeWidth="1.6" markerEnd="url(#cc-arrow)" />
                  <rect x={p.ox + 178} y={y - 4} width="88" height="42" rx="6" fill="#0c141d" />
                  <ellipse cx={p.ox + 222 + s.dx} cy={y + 17 + s.dy} rx={s.rx} ry={s.ry} fill="#2f9e5b" fillOpacity="0.85" stroke="#ff8c00" strokeWidth="1.5" />
                </g>
              )
            })}
            <text x={p.ox + 16} y="232" className="illus-note">{p.cap}</text>
          </g>
        ))}
      </svg>
      <figcaption>{c.illusNote}</figcaption>
    </figure>
  )
}

/* SVA page: embedding-space idea behind the SAC objective (conceptual). */
export function EmbeddingSpace({ labels, caption }) {
  const c = { x: 280, y: 140 }
  const pts = [
    { x: 120, y: 62, t: 'polyp' },
    { x: 92, y: 150, t: 'mucosal protrusion' },
    { x: 130, y: 232, t: 'sessile lesion' },
  ]
  const toward = (p, k) => ({ x: p.x + (c.x - p.x) * k, y: p.y + (c.y - p.y) * k })
  return (
    <figure className="illus">
      <svg viewBox="0 0 560 290" role="img" aria-label={`${labels.image}, ${labels.pulled}, ${labels.pushed}`}>
        <defs>
          <marker id="emb-in" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M1 1 L8 5 L1 9" fill="none" stroke="#0f766e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </marker>
          <marker id="emb-out" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M1 1 L8 5 L1 9" fill="none" stroke="#8798aa" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </marker>
        </defs>

        <circle cx={c.x} cy={c.y} r="64" fill="#ecf7f6" stroke="#cfeae7" strokeDasharray="4 4" />
        {pts.map((p) => {
          const e = toward(p, 0.74)
          return (
            <g key={p.t}>
              <line x1={p.x} y1={p.y} x2={e.x} y2={e.y} stroke="#0f766e" strokeWidth="1.8" markerEnd="url(#emb-in)" />
              <circle cx={p.x} cy={p.y} r="6" fill="#14b8a6" />
              <text x={p.x - 6} y={p.y - 12} className="illus-chip small">{p.t}</text>
            </g>
          )
        })}

        <circle cx={c.x} cy={c.y} r="16" fill="#0f766e" />
        <text x={c.x} y={c.y + 36} textAnchor="middle" className="illus-title">{labels.image}</text>

        <line x1="304" y1="124" x2="446" y2="74" stroke="#8798aa" strokeWidth="1.6" strokeDasharray="5 4" markerEnd="url(#emb-out)" />
        <circle cx="462" cy="68" r="6" fill="#94a3b8" />
        <text x="462" y="50" textAnchor="middle" className="illus-chip small">{labels.other}</text>

        <line x1="318" y1="262" x2="352" y2="262" stroke="#0f766e" strokeWidth="1.8" markerEnd="url(#emb-in)" />
        <text x="362" y="266" className="illus-note">{labels.pulled}</text>
        <line x1="318" y1="282" x2="352" y2="282" stroke="#8798aa" strokeWidth="1.6" strokeDasharray="5 4" markerEnd="url(#emb-out)" />
        <text x="362" y="286" className="illus-note">{labels.pushed}</text>
      </svg>
      <figcaption>{caption}</figcaption>
    </figure>
  )
}

/* SVA page: stable versus unstable DSC across phrasings (illustrative values). */
export function PRBars({ stableTitle, unstableTitle, note }) {
  const stable = [0.72, 0.71, 0.72, 0.73, 0.72, 0.71, 0.72, 0.72, 0.73, 0.71]
  const unstable = [0.72, 0.55, 0.7, 0.4, 0.68, 0.62, 0.3, 0.71, 0.5, 0.66]
  const charts = [
    { ox: 0, title: stableTitle, vals: stable, color: '#0f766e' },
    { ox: 290, title: unstableTitle, vals: unstable, color: '#d97706' },
  ]
  return (
    <figure className="illus">
      <svg viewBox="0 0 560 215" role="img" aria-label={`${stableTitle}, ${unstableTitle}`}>
        {charts.map((ch) => (
          <g key={ch.ox}>
            <text x={ch.ox + 6} y="18" className="illus-title">{ch.title}</text>
            <line x1={ch.ox + 2} y1="168" x2={ch.ox + 252} y2="168" stroke="#cdd6df" />
            {ch.vals.map((v, i) => (
              <rect key={i} x={ch.ox + 6 + i * 24} y={168 - v * 140} width="17" height={v * 140} rx="2" fill={ch.color} fillOpacity="0.85" />
            ))}
            <text x={ch.ox + 128} y="194" textAnchor="middle" className="illus-chip small">
              {`PR Score = ${std(ch.vals).toFixed(3)}`}
            </text>
          </g>
        ))}
      </svg>
      <figcaption>{note}</figcaption>
    </figure>
  )
}

/* SVA page: patch-by-word attention weights (illustrative). */
export function AttnGrid({ patches, words }) {
  const w = [[0.92, 0.78], [0.6, 0.86], [0.12, 0.16], [0.22, 0.1]]
  return (
    <div className="attn" aria-hidden="true">
      <div />
      {words.map((word) => <div key={word} className="attn-word">{word}</div>)}
      {patches.map((p, i) => (
        <div key={p} className="attn-row">
          <div className="attn-patch">{p}</div>
          {w[i].map((v, j) => (
            <div key={j} className="attn-cell" style={{ background: `rgba(15,118,110,${v})` }} />
          ))}
        </div>
      ))}
    </div>
  )
}
