import { useEffect, useRef, useState } from 'react'

const MAX_BYTES = 10 * 1024 * 1024
const ALLOWED = ['image/jpeg', 'image/png']

const formatSize = (bytes) =>
  bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.round(bytes / 1024)} KB`

export default function UploadZone({ t, onRun, busy }) {
  const inputRef = useRef(null)
  const [drag, setDrag] = useState(false)
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview) }, [preview])

  const pick = (f) => {
    if (!f) return
    if (!ALLOWED.includes(f.type)) return setError(t.errType)
    if (f.size > MAX_BYTES) return setError(t.errSize)
    setError('')
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  const openPicker = () => inputRef.current?.click()

  return (
    <section className="card" aria-labelledby="upload-title">
      <div className="card-head">
        <h2 id="upload-title" className="card-title">{t.uploadTitle}</h2>
      </div>

      <div className="card-body">
        {!file ? (
          <div
            className={`dropzone${drag ? ' drag' : ''}`}
            role="button"
            tabIndex={0}
            onClick={openPicker}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openPicker() }
            }}
            onDragOver={(e) => { e.preventDefault(); setDrag(true) }}
            onDragLeave={() => setDrag(false)}
            onDrop={(e) => { e.preventDefault(); setDrag(false); pick(e.dataTransfer.files?.[0]) }}
          >
            <p className="dz-title">{t.dzTitle}</p>
            <p className="dz-or">{t.dzOr}</p>
            <span className="btn btn-secondary">{t.browse}</span>
            <p className="dz-hint">{t.dzHint}</p>
          </div>
        ) : (
          <div className="file-row">
            <img className="file-thumb" src={preview} alt="" />
            <div className="file-info">
              <p className="file-name">{file.name}</p>
              <p className="file-size">{formatSize(file.size)}</p>
            </div>
            <div className="file-actions">
              <button className="btn btn-secondary" onClick={openPicker} disabled={busy}>{t.replace}</button>
              <button className="btn btn-primary" onClick={() => onRun(file)} disabled={busy}>{t.run}</button>
            </div>
          </div>
        )}

        {error && <p className="field-error" role="alert">{error}</p>}
        <p className="upload-note">{t.uploadNote}</p>

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png"
          hidden
          onChange={(e) => { pick(e.target.files?.[0]); e.target.value = '' }}
        />
      </div>
    </section>
  )
}
