require 'active_record'

require_relative 'team'
require_relative 'pick'

class Draft < ActiveRecord::Base
  has_many :teams
  has_many :picks

  def current_pick
    (last_pick_number|| 0) + 1
  end

  def last_pick_number
    (picks.maximum(:number))
  end

  def current_team
    num_picks = last_pick_number
    num_teams = teams.size
    max_picks = total_rounds * num_teams
    return nil if num_picks >= max_picks

    round = num_picks / num_teams + 1
    pick = num_picks % num_teams

    if round % 2 == 1
      teams[pick]
    else
      teams[num_teams-1-pick]
    end
  end
end
