require 'active_record'

require_relative 'team'
require_relative 'manager'
require_relative 'pick'

class Draft < ActiveRecord::Base
  has_many :teams
  has_many :picks

  def commissioners
    Manager.where(id: commissioner_ids)
  end

  def commissioner?(manager)
    commissioner_ids.include? manager.id
  end

  def current_pick
    (last_pick_number || 0) + 1
  end

  def last_pick_number
    (picks.maximum(:number))
  end

  def max_picks
    teams.size * total_rounds
  end

  def current_team
    num_picks = last_pick_number || 0
    num_teams = teams.size
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
