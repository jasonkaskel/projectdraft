require 'active_record'

require_relative 'draft'
require_relative 'pick'

class Team < ActiveRecord::Base
  belongs_to :draft
  has_many :picks

  default_scope { order(order: :asc) }
end
