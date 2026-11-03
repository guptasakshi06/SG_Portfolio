import type { Experiments } from '../../content/types'

/** Cross-record safety for the hand-authored teaching fixtures and future actual notes. */
export function validateExperiments({ demo, illustrative, notes, page }: Experiments): string[] {
  const errors: string[] = []
  const nonempty = (value: string) => typeof value === 'string' && value.trim().length > 0
  for (const [key, value] of Object.entries(page)) if (!nonempty(value)) errors.push(`experiments page.${key}: missing copy`)
  for (const key of ['title', 'notice', 'provenance', 'description', 'accuracyExplanation', 'lossExplanation', 'matrixExplanation'] as const) if (!nonempty(demo[key])) errors.push(`demo.${key}: missing copy`)
  if (!/synthetic/i.test(demo.notice) || !/not Sakshi's project results/.test(demo.notice)) errors.push('demo: explicit synthetic/non-results notice required')
  if (!demo.models.length || new Set(demo.models.map(model => model.id)).size !== demo.models.length || new Set(demo.models.map(model => model.name)).size !== demo.models.length) errors.push('demo: models must be nonempty and unique')
  const comparison = illustrative.find(item => item.id === demo.comparisonId && item.sample)
  if (!comparison || comparison.legend.join('|') !== 'Training|Validation' || comparison.data.length !== demo.models.length || comparison.data.some(row => !demo.models.some(model => model.name === row.label) || row.values.length !== 2 || row.values.some(value => value < 0 || value > 100))) errors.push('demo: invalid synthetic accuracy comparison')
  let epochs: string | null = null
  demo.models.forEach(model => {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(model.id) || !nonempty(model.name)) errors.push('demo: invalid model identity')
    const loss = illustrative.find(item => item.id === model.lossId && item.sample)
    const matrix = illustrative.find(item => item.id === model.matrixId && item.sample)
    if (!loss || loss.legend.join('|') !== 'Training|Validation' || !loss.data.length || loss.data.some((row, i) => row.label !== String(i + 1) || row.values.length !== 2 || row.values.some(value => value < 0))) errors.push(`${model.id}: invalid synthetic loss series`)
    if (loss) {
      const labels = loss.data.map(row => row.label).join('|')
      if (epochs !== null && epochs !== labels) errors.push('demo: loss epochs must align across models')
      epochs = labels
    }
    if (!Number.isInteger(model.validationSize) || model.validationSize < 1 || !matrix || matrix.legend.join('|') !== 'Predicted Class 0|Predicted Class 1' || matrix.data.map(row => row.label).join('|') !== 'Actual Class 0|Actual Class 1' || matrix.data.some(row => row.values.length !== 2 || row.values.some(value => !Number.isInteger(value) || value < 0))) {
      errors.push(`${model.id}: invalid synthetic confusion matrix`)
    } else {
      const total = matrix.data.flatMap(row => row.values).reduce((sum, value) => sum + value, 0)
      const accuracy = comparison?.data.find(row => row.label === model.name)?.values[1]
      const calculated = 100 * (matrix.data[0].values[0] + matrix.data[1].values[1]) / total
      if (total !== model.validationSize || accuracy === undefined || Math.abs(calculated - accuracy) > 0.000001) errors.push(`${model.id}: validation size/accuracy does not match confusion counts`)
    }
  })
  if (new Set(notes.map(note => note.id)).size !== notes.length) errors.push('experiment notes: duplicate IDs')
  notes.forEach(note => {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(note.id) || !['statistical-experiment', 'research-note', 'lesson'].includes(note.kind) || ![note.title, note.text, note.provenance].every(nonempty)) errors.push('experiment note: missing identity, kind, content or provenance')
  })
  return errors
}
