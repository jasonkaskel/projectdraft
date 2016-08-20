require 'active_record'

require_relative 'team'

class Manager < ActiveRecord::Base

  before_save :denormalize_fields

  def denormalize_fields
    self.email = self.email.downcase if self.email
    self.cell = self.cell.gsub(/\D/, '') if self.cell
  end

  def has_next_pick?(draft)
    teams(draft).include?(draft.current_team)
  end

  def teams(draft)
    draft.teams.where("manager_ids @> ARRAY[#{id}]")
  end

  def owner_of
    Team.find_by(owner: self)
  end
end
