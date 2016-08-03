require 'active_record'

require_relative 'pick'

class Athlete < ActiveRecord::Base
  has_one :pick
end
