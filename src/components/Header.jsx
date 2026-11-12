import { useEffect, useState } from 'react'
import { Link } from '../router'

export default function Header({ t, lang, onLang, path, online }) {
  const [open, setOpen] = useState(false)
  useEffect(() => { setOpen(false) }, [path])

  const items = [
    ['/sva', t.nav.sva],
    ['/system', t.nav.system],
  ]
  const showStatus = path === '/demo'
  const state = online === null ? 'unknown' : online ? 'on' : 'off'
  const statusText = online === null ? t.checking : online ? t.online : t.offline

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link to="/" className="brand" aria-label="Coloscope">
          <span className="brand-mark" aria-hidden="true" />
          <span className="brand-text">
            <span className="brand-name">Coloscope</span>
            <span className="brand-sub">{t.brandSub}</span>
          </span>
        </Link>

        <nav className={`nav${open ? ' open' : ''}`} aria-label="Main">
          {items.map(([to, label]) => (
            <Link key={to} to={to} aria-current={path === to ? 'page' : undefined}>{label}</Link>
          ))}
          <Link to="/demo" className="nav-cta" aria-current={path === '/demo' ? 'page' : undefined}>{t.nav.demo}</Link>
        </nav>

        <div className="header-right">
          {showStatus && (
            <span className={`status status-${state}`} role="status">
              <span className="status-dot" aria-hidden="true" />
              <span className="status-text">{statusText}</span>
            </span>
          )}
          <div className="seg" role="group" aria-label="Language">
            {['id', 'en'].map((code) => (
              <button key={code} className={lang === code ? 'on' : ''} aria-pressed={lang === code} onClick={() => onLang(code)}>
                {code.toUpperCase()}
              </button>
            ))}
          </div>
          <button className="menu-btn" aria-expanded={open} aria-label={t.menu} onClick={() => setOpen((o) => !o)}>
            <span /><span /><span />
          </button>
        </div>
      </div>
    </header>
  )
}
