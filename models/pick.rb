require 'active_record'

require_relative 'athlete'
require_relative 'draft'
require_relative 'team'

class Pick < ActiveRecord::Base
  belongs_to :team
  belongs_to :draft
  belongs_to :athlete
end
