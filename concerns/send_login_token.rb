require 'postmark'
require 'twilio-ruby'
require './models/token'

class SendLoginToken

  def self.perform(manager:, expires_at: 10.minutes.from_now, send_token: false)
    token = Token.create! \
      value:      Token.random_token,
      token_type: 'login',
      manager:    manager,
      expires_at: expires_at

    if send_token
      email_login_token(to: manager.email, token: token.value) if manager.email
      sms_login_token(to: manager.cell, token: token.value) if manager.cell
    end

    token
  end

  def self.email_login_token(to:, token:)
    client = Postmark::ApiClient.new(ENV['POSTMARK_API_KEY'])
    client.deliver(
      from:      ENV['POSTMARK_SENDER_SIGNATURE'],
      to:        to,
      subject:   'Your login link',
      text_body: "#{ENV['SITE_URL']}/login?token=#{token}"
    )
  end

  def self.sms_login_token(to:, token:)
    client = Twilio::REST::Client.new ENV['TWILIO_ACCOUNT_SID'], ENV['TWILIO_AUTH_TOKEN']
    client.messages.create(
      from: "+#{ENV['TWILIO_PHONE_NUMBER']}",
      to: "+1#{to}",
      body: "#{ENV['SITE_URL']}/login?token=#{token}"
    )
  end
end
