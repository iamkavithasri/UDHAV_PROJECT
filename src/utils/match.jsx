// Returns sorted matches: best skill overlap first
export function findBestMatches(task, volunteers) {
  const required = task.requiredSkills.map((s) => s.toLowerCase())

  return volunteers
    .filter((v) => v.status === 'Active')
    .map((v) => {
      const volunteerSkills = v.skills.map((s) => s.toLowerCase())
      const matchedSkills = task.requiredSkills.filter((s) =>
        volunteerSkills.includes(s.toLowerCase())
      )
      const score = required.length > 0
        ? Math.round((matchedSkills.length / required.length) * 100)
        : 0
      return { volunteer: v, score, matchedSkills }
    })
    .filter((m) => m.score > 0)
    .sort((a, b) => b.score - a.score)
}

export function matchLabel(score) {
  if (score === 100) return 'Perfect'
  if (score >= 70)  return 'Strong'
  if (score >= 40)  return 'Partial'
  return 'Weak'
}

export function matchBadgeVariant(score) {
  if (score === 100) return 'green'
  if (score >= 70)  return 'gold'
  if (score >= 40)  return 'blue'
  return 'gray'
}