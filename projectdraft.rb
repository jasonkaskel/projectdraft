require 'active_support/time'
require 'json'
require 'sinatra'
require 'sinatra/activerecord'
require 'sinatra/param'

require './models/athlete'
require './models/draft'
require './models/manager'
require './models/pick'
require './models/team'
require './models/token'

set :root, File.dirname(__FILE__)

if development?
  before do
    response.headers['Access-Control-Allow-Origin']='http://projectdraft.dev:3000'
    response.headers['Access-Control-Allow-Headers'] = ['Content-Type', 'Client-Access-Token']
  end
end

before do
  content_type :json
end

before do
  pass if noauth_allowed?
  session_token=env['HTTP_CLIENT_ACCESS_TOKEN']
  token = Token.find_by(value: session_token, token_type: 'session')
  halt 401 unless session_token && token
  @manager = token.manager
end

options '*' do
  status 204
end

post '/api/tokens' do
  param :email_or_cell, String, required: true

  manager =
    Manager.find_by(email: params['email_or_cell'].downcase) ||
    Manager.find_by(cell: params['email_or_cell'].gsub(/\D/,''))
  halt 404 unless manager

  token = Token.create! \
    value: Token.random_token,
    token_type: 'login',
    manager: manager,
    expires_at: 10.minutes.from_now

  # TODO: send text or email with token

  status 201
  { token: token.value }.to_json
end

post '/api/sessions' do
  param :token, String, required: true

  token = Token.find_by \
    value: params.fetch('token'),
    token_type: 'login'
  halt 404 unless token

  session_token = Token.create! \
    value: Token.random_token,
    token_type: 'session',
    manager: token.manager,
    expires_at: 30.days.from_now

  status 201
  { session: session_token.value }.to_json
end

get '/api/athletes' do
  athletes = Athlete.includes(:pick).all

  athletes_serialized = athletes.map do |athlete|
    athlete.as_json.merge(pick: athlete.pick.as_json)
  end

  status 200
  { athletes: athletes_serialized }.to_json
end

post '/api/picks' do
  param :athlete_id, Integer, required: true
  param :team_id, Integer, required: true

  draft = Draft.first
  halt 403 unless @manager.has_next_pick?(draft)

  pick = Pick.create! \
    draft: draft,
    athlete_id: params.fetch('athlete_id'),
    team_id: params.fetch('team_id'),
    number: draft.current_pick

  status 201
  { pick: pick }.to_json
end

get '/api/hc_draft' do
  player_ids = (1..500).to_a.sample(12)
  draft = Draft.find_or_create_by(name: 'Special Teams 2016')
  teams = [
      { name: "Reigning Chumps" },
      { name: "King of the Losers" },
      { name: "Troy's Swag Team" },
      { name: "Roger's Team" },
      { name: "ADHD" },
      { name: "Chinky Winkies" },
      { name: "Boynton Big Timmers" },
      { name: "Joe Knows" },
      { name: "Bit of a Pickle" },
      { name: "Oh Baby Baby Baby" },
    ].map { |t| Team.find_or_create_by(name: t[:name], draft: draft) }

  picks = Pick.includes(:athlete).where(draft: draft).order(number: :asc)
  while picks.length < 62
    round = picks.length / teams.length + 1
    pick = picks.length % teams.length
    nextTeam =
      if round % 2 == 1
        teams[pick]
      else
        teams[teams.length-1-pick]
      end
    athlete = nil
    loop do
      athlete = Athlete.where('average_draft_position < 150').sample
      break if Pick.find_by(athlete: athlete).nil?
    end

    Pick.create! \
      number: draft.current_pick,
      team: nextTeam,
      draft: draft,
      athlete: athlete

    picks = Pick.includes(:athlete).where(draft: draft)
  end

  status 200
  content_type :json
  {
    draft: {
      type: "snake",
      total_rounds: draft.total_rounds,
      teams: teams,
      picks: picks.map { |p| p.as_json.merge(athlete: p.athlete.as_json) },
      on_the_clock: teams.detect { |t| t === draft.current_team },
      can_pick: @manager.has_next_pick?(draft)
    }
  }.to_json
end

def noauth_allowed?
  request.options? ||
    (request.post? && %w(tokens sessions).map { |r| "/api/#{r}" }.include?(request.path_info))
end
