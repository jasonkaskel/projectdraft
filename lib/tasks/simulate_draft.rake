require './projectdraft'
require './models/athlete'
require './models/draft'
require './models/pick'

desc 'simulate a draft'
task :simulate_draft do
  start_pick_time = 3
  min_pick_time = 0.25
  pick_time_decrement = 0.25
  draft_id = 1

  draft = Draft.find(draft_id)
  athletes = Athlete.first(draft.max_picks)
  while team = draft.current_team
    Pick.create! \
      number:  draft.current_pick,
      team:    team,
      draft:   draft,
      athlete: athletes.shift

    sleep [start_pick_time - draft.current_pick * pick_time_decrement, min_pick_time].max
  end
end
