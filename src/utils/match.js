/**
 * match.js — Volunteer ↔ Task matching utility
 * Scores compatibility based on skills, availability, and status.
 */

/**
 * Score a single volunteer against a task (0–100).
 * @param {Object} volunteer
 * @param {Object} task
 * @returns {number} score 0–100
 */
export function scoreMatch(volunteer, task) {
  if (volunteer.status !== 'Active') return 0

  const requiredSkills = task.requiredSkills || []
  const volunteerSkills = volunteer.skills || []

  if (requiredSkills.length === 0) return 50 // no skill filter → neutral

  // Case-insensitive skill matching
  const matched = requiredSkills.filter((rs) =>
    volunteerSkills.some((vs) => vs.toLowerCase() === rs.toLowerCase())
  )

  const skillScore = (matched.length / requiredSkills.length) * 100
  return Math.round(skillScore)
}

/**
 * Find and rank volunteers for a given task.
 * @param {Object}   task
 * @param {Object[]} volunteers
 * @param {number}   threshold — minimum score to include (default 30)
 * @returns {Array<{ volunteer, score, matchedSkills }>} sorted descending
 */
export function findBestMatches(task, volunteers, threshold = 30) {
  return volunteers
    .map((volunteer) => {
      const score = scoreMatch(volunteer, task)
      const matchedSkills = (task.requiredSkills || []).filter((rs) =>
        (volunteer.skills || []).some((vs) => vs.toLowerCase() === rs.toLowerCase())
      )
      return { volunteer, score, matchedSkills }
    })
    .filter((r) => r.score >= threshold)
    .sort((a, b) => b.score - a.score)
}

/**
 * Generate a human-readable match label.
 * @param {number} score
 * @returns {string}
 */
export function matchLabel(score) {
  if (score >= 90) return 'Excellent'
  if (score >= 70) return 'Good'
  if (score >= 50) return 'Fair'
  if (score >= 30) return 'Partial'
  return 'Poor'
}

/**
 * Get badge variant for a match score.
 * @param {number} score
 * @returns {string} badge class suffix
 */
export function matchBadgeVariant(score) {
  if (score >= 90) return 'green'
  if (score >= 70) return 'gold'
  if (score >= 50) return 'blue'
  return 'gray'
}