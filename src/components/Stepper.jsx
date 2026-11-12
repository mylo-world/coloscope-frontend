export default function Stepper({ t, step }) {
  const states =
    step === 'predicting' ? ['done', 'active', 'pending']
    : step === 'explaining' ? ['done', 'done', 'active']
    : ['done', 'done', 'done']

  return (
    <ol className="stepper" aria-label="Progress">
      {t.steps.map((label, i) => (
        <li key={label} className={`step ${states[i]}`} aria-current={states[i] === 'active' ? 'step' : undefined}>
          <span className="step-dot">{states[i] === 'active' ? '' : i + 1}</span>
          <span className="step-label">{label}</span>
        </li>
      ))}
    </ol>
  )
}
