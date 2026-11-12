import { useState } from 'react'

export default function ImageViewer({ t, originalSrc, overlaySrc }) {
  const [mode, setMode] = useState('side')
  const [pos, setPos] = useState(50)

  const modes = [
    ['side', t.viewSide],
    ['slider', t.viewSlider],
    ['overlay', t.viewOverlay],
  ]

  return (
    <section className="card">
      <div className="card-head">
        <h2 className="card-title">{t.segmentation}</h2>
        <div className="seg" role="tablist" aria-label={t.segmentation}>
          {modes.map(([key, label]) => (
            <button
              key={key}
              role="tab"
              aria-selected={mode === key}
              className={mode === key ? 'on' : ''}
              onClick={() => setMode(key)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="card-body">
        <div className="stage">
          {mode === 'side' && (
            <div className="side">
              <figure>
                <img src={originalSrc} alt={t.originalAlt} />
                <figcaption>{t.original}</figcaption>
              </figure>
              <figure>
                <img src={overlaySrc} alt={t.overlayAlt} />
                <figcaption>{t.overlay}</figcaption>
              </figure>
            </div>
          )}

          {mode === 'slider' && (
            <div className="compare">
              <img src={overlaySrc} alt={t.overlayAlt} draggable={false} />
              <img
                className="compare-top"
                src={originalSrc}
                alt={t.originalAlt}
                draggable={false}
                style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
              />
              <span className="compare-tag left">{t.original}</span>
              <span className="compare-tag right">{t.overlay}</span>
              <span className="compare-line" style={{ left: `${pos}%` }}>
                <span className="compare-knob" />
              </span>
              <input
                type="range"
                min="0"
                max="100"
                value={pos}
                onChange={(e) => setPos(Number(e.target.value))}
                aria-label={t.sliderLabel}
              />
            </div>
          )}

          {mode === 'overlay' && (
            <figure>
              <img src={overlaySrc} alt={t.overlayAlt} />
              <figcaption>{t.overlay}</figcaption>
            </figure>
          )}
        </div>

        <ul className="legend">
          <li><span className="sw sw-fill" />{t.legendFill}</li>
          <li><span className="sw sw-edge" />{t.legendEdge}</li>
        </ul>
      </div>
    </section>
  )
}
