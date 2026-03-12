// Parse player count suffix: "Việt Anh 2" => count=2
export function parsePlayerEntry(raw) {
  if (!raw || !raw.trim()) return { name: raw || '', count: 1 }
  const match = raw.trim().match(/^(.+?)\s+(\d+)$/)
  if (match) {
    const n = parseInt(match[2])
    if (n > 1 && n < 10) return { name: match[1].trim(), count: n, rawSuffix: n }
  }
  return { name: raw.trim(), count: 1 }
}

// Build full player list with numbered positions
export function buildPlayerList(inputs) {
  let num = 1
  return inputs
    .filter(v => v.trim())
    .map(raw => {
      const { name, count } = parsePlayerEntry(raw)
      const obj = { raw: raw.trim(), name, count, num }
      num += count
      return obj
    })
}

// Get all players used in a given round
export function getUsedInRound(round) {
  if (!round) return new Set()
  const used = new Set()
  round.courts.forEach(c => {
    ;[...c.teamA, ...c.teamB].forEach(p => { if (p) used.add(p) })
  })
  return used
}

// Check warnings for a court in a round
export function getWarnings(rounds, roundIdx, courtIdx) {
  if (roundIdx < 1) return []
  const warnings = []
  const court = rounds[roundIdx]?.courts[courtIdx]
  if (!court) return []
  const allCurrent = [...court.teamA, ...court.teamB].filter(Boolean)

  // Same court streak > 2
  allCurrent.forEach(player => {
    let streak = 0
    for (let r = roundIdx; r >= 0; r--) {
      const c = rounds[r]?.courts[courtIdx]
      if (!c) break
      const inCourt = [...c.teamA, ...c.teamB].filter(Boolean)
      if (inCourt.includes(player)) streak++
      else break
    }
    if (streak > 2) warnings.push(`"${player}" đã ở sân này ${streak} round liên tiếp!`)
  })

  // Same team pair > 2 rounds
  const checkTeamPair = (team) => {
    const players = team.filter(Boolean)
    if (players.length < 2) return
    const [p1, p2] = players
    let streak = 0
    for (let r = roundIdx; r >= 0; r--) {
      const c = rounds[r]?.courts[courtIdx]
      if (!c) break
      const inA = c.teamA.includes(p1) && c.teamA.includes(p2)
      const inB = c.teamB.includes(p1) && c.teamB.includes(p2)
      if (inA || inB) streak++
      else break
    }
    if (streak > 2) warnings.push(`"${p1}" & "${p2}" đã cùng đội ${streak} round liên tiếp!`)
  }
  checkTeamPair(court.teamA)
  checkTeamPair(court.teamB)

  return warnings
}

// Format date nicely
export function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr + 'T00:00:00')
  const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']
  return `${days[d.getDay()]} ${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`
}
