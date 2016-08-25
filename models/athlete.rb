require 'active_record'

require_relative 'pick'

class Athlete < ActiveRecord::Base
  has_one :pick

  default_scope { order(average_draft_position: :asc) }
end
