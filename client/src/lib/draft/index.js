export const roundNumber = (pickNum, teamSize) => (
  Math.floor(pickNum / teamSize) + 1
)

export const pickNumber = (pickNum, teamSize) => (
  pickNum % teamSize
)

export const nextPickNumber = (picks, teamSize) => (
  (pickNumber(picks[picks.length-1].number, teamSize) + 1) % teamSize
)
