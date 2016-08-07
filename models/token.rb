require 'active_record'
require 'securerandom'

require_relative 'manager'

class Token < ActiveRecord::Base
  belongs_to :manager

  validates_uniqueness_of :value, scope: :token_type

  TOKEN_TYPES = %w(login session).freeze
  validates :token_type, inclusion: { in: TOKEN_TYPES }

  def self.random_token
    random = nil
    loop do
      random = SecureRandom.urlsafe_base64(20)
      break unless Token.where(value: random).count > 0
    end
    random
  end
end
