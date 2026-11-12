import { PageHero, Section, Callout, ScrollNav } from '../components/Layout'
import { ConceptCompare, EmbeddingSpace, PRBars, AttnGrid } from '../components/Illustrations'

// Measured results on the Kvasir-SEG test split (10 phrasings per image).
// [key, usesText, DSC, worst-case DSC, NSD, PR Score, relative PR]
const ROWS = [
  ['ours', true, 0.7176, 0.7005, 0.3715, 0.0112, 0.0326],
  ['a2', true, 0.7433, 0.7112, 0.3247, 0.0145, 0.0946],
  ['a3', true, 0.7620, 0.7096, 0.3699, 0.0243, 0.0797],
  ['a4', true, 0.7652, 0.7269, 0.4103, 0.0247, 0.1229],
  ['a1', false, 0.8454, 0.8454, 0.5401, 0.0, 0.0],
]
const PR_MAX = 0.025

function Arch({ a }) {
  const N = a.nodes
  const train = (extra) => `${a.status.train} · ${extra}`
  return (
    <>
      <div className="arch">
        <div className="arch-node io n-image">
          <p className="arch-title">{N.image.t}</p>
          <p className="arch-desc">{N.image.d}</p>
        </div>
        <div className="arch-node frozen n-enc">
          <p className="arch-title">{N.enc.t}</p>
          <p className="arch-desc">{N.enc.d}</p>
          <span className="arch-status">{a.status.frozen}</span>
        </div>
        <div className="arch-node io n-text">
          <p className="arch-title">{N.text.t}</p>
          <p className="arch-desc">{N.text.d}</p>
        </div>
        <div className="arch-node frozen n-bert">
          <p className="arch-title">{N.bert.t}</p>
          <p className="arch-desc">{N.bert.d}</p>
          <span className="arch-status">{a.status.frozen}</span>
        </div>
        <div className="arch-node train n-sva">
          <p className="arch-title">{N.sva.t}</p>
          <p className="arch-desc">{N.sva.d}</p>
          <span className="arch-status train">{train(a.params[3][2])}</span>
        </div>
        <div className="arch-node train n-dec">
          <p className="arch-title">{N.dec.t}</p>
          <p className="arch-desc">{N.dec.d}</p>
          <span className="arch-status train">{train(a.params[4][2])}</span>
        </div>
        <div className="arch-node io n-mask last">
          <p className="arch-title">{N.mask.t}</p>
          <p className="arch-desc">{N.mask.d}</p>
        </div>
      </div>
      <ul className="legend arch-legend">
        <li><span className="sw sw-frozen" />{a.legendFrozen}</li>
        <li><span className="sw sw-train" />{a.legendTrain}</li>
      </ul>
    </>
  )
}

export default function Sva({ c }) {
  const s = c.sva
  const r = s.results
  return (
    <>
      <PageHero eyebrow={s.eyebrow} title={s.title} lead={s.lead}>
        <ScrollNav label={s.onThisPage} items={s.toc} />
      </PageHero>

      {/* Problem */}
      <Section id="problem" title={s.problem.title}>
        <div className="prose-col">
          {s.problem.body.map((p) => <p key={p}>{p}</p>)}
        </div>
        <ConceptCompare c={s.problem} />
      </Section>

      {/* Architecture */}
      <Section id="architecture" alt title={s.architecture.title} lead={s.architecture.lead}>
        <Arch a={s.architecture} />
        <p className="note">{s.architecture.note}</p>

        <h3 className="sub-h">{s.architecture.paramsTitle}</h3>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>{s.architecture.paramHead.map((h, i) => <th key={h} className={i === 2 ? 'num' : ''}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {s.architecture.params.map((row) => (
                <tr key={row[0]}>
                  <td><strong>{row[0]}</strong></td>
                  <td>{row[1]}</td>
                  <td className="num">{row[2]}</td>
                  <td><span className={`chip ${row[3] === s.architecture.params[0][3] ? 'chip-frozen' : 'chip-train'}`}>{row[3]}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="note"><strong>{s.architecture.paramTotal}</strong></p>
      </Section>

      {/* Alignment */}
      <Section id="alignment" title={s.alignment.title} lead={s.alignment.body}>
        <div className="grid-3">
          {s.alignment.steps.map((st, i) => (
            <div key={st.t} className="tile">
              <span className="tile-n">{String(i + 1).padStart(2, '0')}</span>
              <h3>{st.t}</h3>
              <p>{st.d}</p>
            </div>
          ))}
        </div>
        <h3 className="sub-h">{s.alignment.attnTitle}</h3>
        <figure className="illus narrow">
          <AttnGrid patches={s.alignment.patches} words={s.alignment.words} />
          <figcaption>{s.alignment.attnCaption}</figcaption>
        </figure>
      </Section>

      {/* Objective */}
      <Section id="objective" alt title={s.objective.title}>
        <div className="prose-col">
          {s.objective.body.map((p) => <p key={p}>{p}</p>)}
        </div>
        <div className="formula">
          <code>{s.objective.formulaTotal}</code>
          <code>{s.objective.formulaSac}</code>
          <p>{s.objective.legend}</p>
        </div>
        <h3 className="sub-h">{s.objective.embTitle}</h3>
        <EmbeddingSpace labels={s.objective.embLabels} caption={s.objective.embCaption} />
      </Section>

      {/* Metric */}
      <Section id="metric" title={s.metric.title}>
        <div className="prose-col">
          {s.metric.body.map((p) => <p key={p}>{p}</p>)}
        </div>
        <div className="formula">
          <code>{s.metric.formula}</code>
        </div>
        <PRBars stableTitle={s.metric.stableTitle} unstableTitle={s.metric.unstableTitle} note={s.metric.illusNote} />
        <Callout title={s.metric.caveatTitle} tone="warn">{s.metric.caveat}</Callout>
      </Section>

      {/* Results */}
      <Section id="results" alt title={r.title} lead={r.lead}>
        <div className="table-wrap">
          <table className="data-table results">
            <thead>
              <tr>{r.head.map((h, i) => <th key={h} className={i >= 2 ? 'num' : ''}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {ROWS.map(([key, text, dsc, worst, nsd, pr, rel]) => (
                <tr key={key} className={key === 'ours' ? 'hl' : key === 'a1' ? 'muted' : ''}>
                  <td><strong>{r.names[key]}</strong></td>
                  <td>{text ? r.yes : r.no}</td>
                  <td className="num">{dsc.toFixed(4)}</td>
                  <td className="num">{worst.toFixed(4)}</td>
                  <td className="num">{nsd.toFixed(4)}</td>
                  <td className="num">
                    {text ? (
                      <div className="cov-cell">
                        <div className="bar"><span style={{ width: `${Math.min(100, (pr / PR_MAX) * 100)}%` }} /></div>
                        <span className="cov-val">{pr.toFixed(4)}</span>
                      </div>
                    ) : `${pr.toFixed(4)}*`}
                  </td>
                  <td className="num">{text ? rel.toFixed(3) : `${rel.toFixed(3)}*`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="note">* {r.footnote}</p>

        <h3 className="sub-h">{r.readTitle}</h3>
        <ul className="checklist">
          {r.read.map((x) => <li key={x}>{x}</li>)}
        </ul>
      </Section>

      {/* Limits */}
      <Section id="limits" title={s.limits.title}>
        <div className="grid-2">
          <div className="tile">
            <h3>{s.limits.limitsTitle}</h3>
            <ul className="checklist">
              {s.limits.limits.map((x) => <li key={x}>{x}</li>)}
            </ul>
          </div>
          <div className="tile">
            <h3>{s.limits.nextTitle}</h3>
            <ul className="checklist">
              {s.limits.next.map((x) => <li key={x}>{x}</li>)}
            </ul>
          </div>
        </div>
      </Section>
    </>
  )
}
