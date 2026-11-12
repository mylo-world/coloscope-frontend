import { useCallback, useEffect, useRef, useState } from 'react'
import { PageHero } from '../components/Layout'
import UploadZone from '../components/UploadZone'
import Stepper from '../components/Stepper'
import ResultPanel from '../components/ResultPanel'
import { predictImage, explainResult } from '../api'

const STEP = { IDLE: 'idle', PREDICTING: 'predicting', EXPLAINING: 'explaining', DONE: 'done', ERROR: 'error' }

export default function Demo({ t, lang }) {
  const [step, setStep] = useState(STEP.IDLE)
  const [error, setError] = useState(null)
  const [predict, setPredict] = useState(null)
  const [explain, setExplain] = useState(null)
  const [explainFailed, setExplainFailed] = useState(false)
  const [originalSrc, setOriginalSrc] = useState(null)
  const [file, setFile] = useState(null)
  const [runs, setRuns] = useState([])
  const [rerunning, setRerunning] = useState(false)
  const [resetKey, setResetKey] = useState(0)

  const resultRef = useRef(null)
  const scrollNext = useRef(false)
  const runId = useRef(0)

  useEffect(() => {
    if (predict && scrollNext.current) {
      scrollNext.current = false
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [predict])

  // again = true re-runs the same image; the backend picks another phrasing.
  const execute = useCallback(async (f, again) => {
    const id = ++runId.current
    setError(null)
    if (again) {
      setRerunning(true)
    } else {
      setStep(STEP.PREDICTING)
      setPredict(null)
      setExplain(null)
      setExplainFailed(false)
      setRuns([])
      scrollNext.current = true
    }

    let pred
    try {
      pred = await predictImage(f)
    } catch (e) {
      if (id !== runId.current) return
      setRerunning(false)
      setError(e.message || String(e))
      if (!again) setStep(STEP.ERROR)
      return
    }
    if (id !== runId.current) return

    setRerunning(false)
    setPredict(pred)
    setRuns((r) => [
      ...r,
      { prompt: pred.prompt_used, coverage: Number(pred.mask_coverage) || 0, ms: pred.inference_ms },
    ])
    setExplain(null)
    setExplainFailed(false)
    setStep(STEP.EXPLAINING)

    // A failed explanation must not discard a valid segmentation result.
    try {
      const expl = await explainResult(pred.prompt_used, pred.dsc_estimate, pred.mask_coverage)
      if (id === runId.current) setExplain(expl)
    } catch {
      if (id === runId.current) setExplainFailed(true)
    }
    if (id === runId.current) setStep(STEP.DONE)
  }, [])

  const handleRun = (f) => {
    setFile(f)
    setOriginalSrc((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return URL.createObjectURL(f)
    })
    execute(f, false)
  }

  const handleRerun = () => { if (file) execute(file, true) }

  const handleReset = () => {
    runId.current += 1
    setOriginalSrc((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return null
    })
    setFile(null)
    setStep(STEP.IDLE)
    setError(null)
    setPredict(null)
    setExplain(null)
    setExplainFailed(false)
    setRuns([])
    setRerunning(false)
    setResetKey((k) => k + 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const showUpload = step === STEP.IDLE || step === STEP.ERROR || step === STEP.PREDICTING
  const showStepper = step === STEP.PREDICTING || step === STEP.EXPLAINING || step === STEP.DONE
  const showResults = predict && (step === STEP.EXPLAINING || step === STEP.DONE)

  return (
    <>
      <PageHero eyebrow={t.demoEyebrow} title={t.demoTitle} lead={t.demoLead} />

      <div className="container section">
        {showUpload && <UploadZone key={resetKey} t={t} onRun={handleRun} busy={step === STEP.PREDICTING} />}

        {error && (
          <div className="alert" role="alert" style={{ marginTop: showUpload ? 20 : 0 }}>
            <p className="alert-title">{t.errorTitle}</p>
            <p className="alert-msg">{error}</p>
            <p className="alert-hint">{t.errorHint}</p>
          </div>
        )}

        {showStepper && (
          <div style={{ marginTop: showUpload || error ? 20 : 0 }}>
            <Stepper t={t} step={step} />
          </div>
        )}

        <div ref={resultRef} className="result-anchor">
          {showResults && (
            <ResultPanel
              t={t}
              lang={lang}
              originalSrc={originalSrc}
              predict={predict}
              explain={explain}
              explainFailed={explainFailed}
              loading={step === STEP.EXPLAINING}
              fileInfo={file ? { name: file.name, size: file.size } : null}
              runs={runs}
              rerunning={rerunning}
              onRerun={handleRerun}
              onReset={handleReset}
            />
          )}
        </div>
      </div>
    </>
  )
}
