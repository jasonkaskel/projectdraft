export const roundNumber = (pickNum, teamSize) => {
  const round = Math.floor(pickNum / teamSize)
  return round === (pickNum / teamSize) ? round : round + 1
}

export const pickNumber = (pickNum, teamSize) => {
  const pick = pickNum % teamSize
  return pick === 0 ? teamSize : pick
}

export const nextPickNumber = (picks, teamSize) => {
  if (picks.length === 0) return 1
  const pick = (pickNumber(picks[picks.length-1].number, teamSize) + 1) % teamSize
  return pick === 0 ? teamSize : pick
}
