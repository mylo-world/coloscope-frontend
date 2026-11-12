import { useEffect, useState } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Sva from './pages/Sva'
import System from './pages/System'
import Demo from './pages/Demo'
import { useRoute } from './router'
import { checkHealth } from './api'
import { STR } from './i18n'
import { CONTENT } from './content'

const LANG_KEY = 'coloscope-lang'

// Indonesian by default (expo audience); the visitor's choice is remembered.
const initialLang = () => {
  try {
    const saved = localStorage.getItem(LANG_KEY)
    if (saved === 'id' || saved === 'en') return saved
  } catch { /* storage unavailable */ }
  return 'id'
}

export default function App() {
  const [lang, setLang] = useState(initialLang)
  const [online, setOnline] = useState(null)
  const path = useRoute()

  const t = STR[lang]
  const c = CONTENT[lang]

  const chooseLang = (code) => {
    setLang(code)
    try { localStorage.setItem(LANG_KEY, code) } catch { /* ignore */ }
  }

  useEffect(() => { document.documentElement.lang = lang }, [lang])

  // Only ping the backend while the demo page is open.
  useEffect(() => {
    if (path !== '/demo') return undefined
    let alive = true
    const ping = async () => {
      const ok = await checkHealth()
      if (alive) setOnline(ok)
    }
    ping()
    const id = setInterval(ping, 30000)
    return () => { alive = false; clearInterval(id) }
  }, [path])

  let page
  let title
  switch (path) {
    case '/sva': page = <Sva c={c} />; title = c.sva.title; break
    case '/system': page = <System c={c} />; title = c.system.title; break
    case '/demo': page = <Demo t={t} lang={lang} />; title = t.demoTitle; break
    default: page = <Home c={c} />; title = null
  }

  useEffect(() => {
    document.title = title ? `${title} | Coloscope` : 'Coloscope | Colorectal image analysis'
  }, [title])

  return (
    <>
      <Header t={t} lang={lang} onLang={chooseLang} path={path} online={online} />
      <main>{page}</main>
      <Footer t={t} />
    </>
  )
}
