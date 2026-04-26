export function scoreMatch(volunteer, task) {
  if (volunteer.status !== 'Active') return 0

  const requiredSkills = task.requiredSkills || []
  const volunteerSkills = volunteer.skills || []

  if (requiredSkills.length === 0) return 50

  const matched = requiredSkills.filter((rs) =>
    volunteerSkills.some((vs) => vs.toLowerCase() === rs.toLowerCase())
  )

  const skillScore = (matched.length / requiredSkills.length) * 100
  return Math.round(skillScore)
}

export function findBestMatches(task, volunteers, threshold = 30) {
  return volunteers
    .map((volunteer) => {
      const score = scoreMatch(volunteer, task)
      const matchedSkills = (task.requiredSkills || []).filter((rs) =>
        (volunteer.skills || []).some((vs) =>
          vs.toLowerCase() === rs.toLowerCase()
        )
      )
      return { volunteer, score, matchedSkills }
    })
    .filter((r) => r.score >= threshold)
    .sort((a, b) => b.score - a.score)
}

export function matchLabel(score) {
  if (score >= 90) return 'Excellent'
  if (score >= 70) return 'Good'
  if (score >= 50) return 'Fair'
  if (score >= 30) return 'Partial'
  return 'Poor'
}

export function matchBadgeVariant(score) {
  if (score >= 90) return 'green'
  if (score >= 70) return 'gold'
  if (score >= 50) return 'blue'
  return 'gray'
}