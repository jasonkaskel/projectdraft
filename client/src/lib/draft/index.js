export const roundNumber = (pickNum, teamSize) => (
  Math.floor(pickNum / teamSize) + 1
)

export const pickNumber = (pickNum, teamSize) => {
  const pick = pickNum % teamSize
  return pick === 0 ? teamSize : pick
}

export const nextPickNumber = (picks, teamSize) => {
  const pick = (pickNumber(picks[picks.length-1].number, teamSize) + 1) % teamSize
  return pick === 0 ? teamSize : pick
}
