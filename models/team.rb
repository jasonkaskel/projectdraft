require 'active_record'

require_relative 'draft'
require_relative 'pick'
require_relative 'manager'

class Team < ActiveRecord::Base
  belongs_to :draft
  belongs_to :owner, class_name: 'Manager'
  has_many :picks

  default_scope { order(order: :asc) }
end
