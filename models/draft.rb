require 'active_record'

require_relative 'team'
require_relative 'pick'

class Draft < ActiveRecord::Base
  has_many :teams
  has_many :picks

  def current_pick
    (picks.maximum(:number) || 0) + 1
  end
end
