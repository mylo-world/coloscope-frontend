import { useState } from 'react'
import ImageViewer from './ImageViewer'

const level = (label = '') => {
  const l = label.toLowerCase()
  if (l.startsWith('high')) return 'high'
  if (l.startsWith('low')) return 'low'
  return 'mid'
}

// The backend text may already start with "Possible finding:" or "Next steps:".
const clean = (s = '') =>
  s.replace(
    /^\s*(possible finding(?: based on ai detection)?|next steps?|kemungkinan temuan|langkah (?:selanjutnya|lanjutan))\s*:\s*/i,
    ''
  )

const formatSize = (bytes) =>
  bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.round(bytes / 1024)} KB`

function Skeleton({ h = 14, w = '100%', style }) {
  return <div className="skeleton" style={{ height: h, width: w, ...style }} />
}

export default function ResultPanel({
  t, lang, originalSrc, predict, explain, explainFailed, loading,
  fileInfo, runs, rerunning, onRerun, onReset,
}) {
  const [audience, setAudience] = useState('patient')
  const overlaySrc = `data:image/png;base64,${predict.overlay_b64}`
  const coverage = Number(predict.mask_coverage) || 0

  const text = explain
    ? audience === 'patient'
      ? (lang === 'id' ? explain.awam_id : explain.awam_en)
      : (lang === 'id' ? explain.medis_id : explain.medis_en)
    : null
  const lvl = explain ? level(explain.confidence_label) : null

  const covs = runs.map((r) => r.coverage)
  const spread = covs.length > 1 ? Math.max(...covs) - Math.min(...covs) : 0
  const maxCov = Math.max(1, ...covs)

  return (
    <div>
      <div className="result-head">
        <div>
          <h2>{t.resultTitle}</h2>
          {fileInfo && <p className="result-meta">{fileInfo.name} &middot; {formatSize(fileInfo.size)}</p>}
        </div>
        <div className="result-actions">
          <a className="btn btn-secondary" href={overlaySrc} download="coloscope-overlay.png">{t.downloadOverlay}</a>
          <button className="btn btn-secondary" onClick={onRerun} disabled={rerunning}>
            {rerunning ? t.rerunning : t.rerun}
          </button>
          <button className="btn btn-primary" onClick={onReset}>{t.newAnalysis}</button>
        </div>
      </div>

      <div className="result-grid">
        <ImageViewer t={t} originalSrc={originalSrc} overlaySrc={overlaySrc} />

        <section className="card">
          <div className="card-head">
            <h2 className="card-title">{t.summary}</h2>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="row-line">
                <span className="row-key">{t.prompt}</span>
                <span className="row-val"><span className="pill">{predict.prompt_used}</span></span>
              </div>
            </div>

            <div className="row">
              <div className="row-line">
                <span className="row-key">{t.coverage}</span>
                <span className="row-val">{coverage.toFixed(1)}%</span>
              </div>
              <div className="bar" aria-hidden="true"><span style={{ width: `${Math.min(100, coverage)}%` }} /></div>
            </div>

            <div className="row">
              <div className="row-line">
                <span className="row-key">{t.inference}</span>
                <span className="row-val">{Math.round(predict.inference_ms)} ms</span>
              </div>
            </div>

            <div className="row">
              <div className="row-line">
                <span className="row-key">{t.confidence}</span>
                <span className="row-val">
                  {explain
                    ? <span className={`badge badge-${lvl}`}>{t.conf[lvl]}</span>
                    : explainFailed ? '-' : <Skeleton h={22} w={90} />}
                </span>
              </div>
            </div>

            <p className="note">{t.confNote}</p>
          </div>
        </section>
      </div>

      {runs.length > 1 && (
        <section className="card" style={{ marginBottom: 20 }}>
          <div className="card-head">
            <h2 className="card-title">{t.runsTitle}</h2>
          </div>
          <div className="card-body">
            <p className="note" style={{ marginTop: 0, marginBottom: 14 }}>{t.runsHint}</p>
            <div className="table-wrap">
              <table className="data-table runs">
                <thead>
                  <tr>
                    <th>{t.colRun}</th>
                    <th>{t.colPhrasing}</th>
                    <th>{t.colCoverage}</th>
                    <th className="num">{t.colTime}</th>
                  </tr>
                </thead>
                <tbody>
                  {runs.map((r, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td><span className="pill">{r.prompt}</span></td>
                      <td>
                        <div className="cov-cell">
                          <div className="bar"><span style={{ width: `${(r.coverage / maxCov) * 100}%` }} /></div>
                          <span className="cov-val">{r.coverage.toFixed(1)}%</span>
                        </div>
                      </td>
                      <td className="num">{Math.round(r.ms)} ms</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="note">{t.spread}: <strong>{spread.toFixed(1)}</strong> {t.ppUnit}</p>
          </div>
        </section>
      )}

      <section className="card">
        <div className="card-head">
          <h2 className="card-title">{t.interpretation}</h2>
          <div className="seg" role="tablist" aria-label={t.interpretation}>
            {[['patient', t.patient], ['clinician', t.clinician]].map(([key, label]) => (
              <button
                key={key}
                role="tab"
                aria-selected={audience === key}
                className={audience === key ? 'on' : ''}
                onClick={() => setAudience(key)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="card-body">
          {explainFailed && <p className="muted-msg">{t.explainFail}</p>}

          {!explainFailed && (
            <div className="interp">
              <div>
                {loading && !explain ? (
                  <div style={{ display: 'grid', gap: 10, marginTop: 4 }}>
                    <Skeleton /><Skeleton w="92%" /><Skeleton w="76%" />
                  </div>
                ) : (
                  <p className="prose" style={{ marginTop: 0 }}>{text}</p>
                )}
              </div>

              <div>
                <div className="finding">
                  <p className="finding-label">{t.finding}</p>
                  {explain
                    ? <p className="finding-text">{clean(explain.diagnosis)}</p>
                    : <Skeleton h={14} style={{ marginTop: 8 }} />}
                </div>
                <div className="finding alt">
                  <p className="finding-label">{t.nextSteps}</p>
                  {explain
                    ? <p className="finding-text">{clean(explain.recommendation)}</p>
                    : <Skeleton h={14} style={{ marginTop: 8 }} />}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="card-foot">{t.disclaimer}</div>
      </section>
    </div>
  )
}
