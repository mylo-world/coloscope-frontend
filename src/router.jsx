import { useEffect, useState } from 'react'

// Tiny hash router: works on any static host without rewrite rules.
const normalize = (hash) => {
  let p = (hash || '').replace(/^#/, '') || '/'
  if (!p.startsWith('/')) p = '/' + p
  if (p.length > 1 && p.endsWith('/')) p = p.slice(0, -1)
  return p
}

export function useRoute() {
  const [path, setPath] = useState(() => normalize(window.location.hash))
  useEffect(() => {
    const onChange = () => {
      setPath(normalize(window.location.hash))
      window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  return path
}

export function Link({ to, children, ...rest }) {
  return <a href={`#${to}`} {...rest}>{children}</a>
}
