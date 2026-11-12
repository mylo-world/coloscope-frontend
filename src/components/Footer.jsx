import { Link } from '../router'
import { CREDITS, INSTITUTION } from '../config'

export default function Footer({ t }) {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <p className="footer-brand">Coloscope</p>
          <p className="footer-line">{t.footerBlurb}</p>
          <p className="footer-line">{INSTITUTION}</p>
        </div>

        <div>
          <ul className="footer-links">
            <li><Link to="/sva">{t.nav.sva}</Link></li>
            <li><Link to="/system">{t.nav.system}</Link></li>
            <li><Link to="/demo">{t.nav.demo}</Link></li>
          </ul>
        </div>

        <div>
          {CREDITS.length > 0 && (
            <>
              <p className="footer-heading">{t.footerCredits}</p>
              <ul className="footer-credits">
                {CREDITS.map((p) => (
                  <li key={p.name}><strong>{p.name}</strong>{p.role ? `, ${p.role}` : ''}</li>
                ))}
              </ul>
            </>
          )}
          <p className="footer-line">{t.footerModel}</p>
        </div>
      </div>

      <div className="container">
        <p className="footer-disclaimer">{t.disclaimer}</p>
      </div>
    </footer>
  )
}
