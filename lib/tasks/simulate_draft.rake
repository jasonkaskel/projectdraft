require './projectdraft'
require './models/athlete'
require './models/draft'
require './models/pick'

desc 'simulate a draft'
task :simulate_draft, [:draft_id, :max_picks] do |t, args|
  start_pick_time = 3
  min_pick_time = 0.5
  pick_time_decrement = 0.25
  draft_id = args[:draft_id].to_i || 1
  max_picks = args[:max_picks].to_i

  draft = Draft.find(draft_id)
  picks = draft.picks
  athletes = Athlete.all - picks.map { |pick| pick.athlete }
  pick_count = 0
  while (team = draft.current_team) && (!max_picks || pick_count < max_picks)
    Pick.create! \
      number:  draft.current_pick,
      team:    team,
      draft:   draft,
      athlete: athletes.shift

    sleep [start_pick_time - draft.current_pick * pick_time_decrement, min_pick_time].max
    pick_count += 1
  end
end
