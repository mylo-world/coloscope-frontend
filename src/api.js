const BASE = import.meta.env.VITE_API_URL || '/api'

export async function predictImage(file) {
  const form = new FormData()
  form.append('file', file)
  const res = await fetch(`${BASE}/predict`, { method: 'POST', body: form })
  if (!res.ok) throw new Error(`Prediction failed (${res.status} ${res.statusText})`)
  return res.json()
}

export async function explainResult(prompt, dsc_estimate, mask_coverage) {
  const res = await fetch(`${BASE}/explain`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, dsc_estimate, mask_coverage }),
  })
  if (!res.ok) throw new Error(`Explanation failed (${res.status} ${res.statusText})`)
  return res.json()
}

export async function checkHealth() {
  try {
    const res = await fetch(`${BASE}/health`)
    return res.ok
  } catch {
    return false
  }
}
