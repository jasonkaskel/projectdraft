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
require './concerns/send_login_token'

set :root, File.dirname(__FILE__)

if development?
  before do
    response.headers['Access-Control-Allow-Origin']='http://projectdraft.dev:3000'
    response.headers['Access-Control-Allow-Headers'] = ['Content-Type', 'Client-Access-Token']
    response.headers['Access-Control-Allow-Methods'] = ['GET', 'POST', 'PUT']
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

before '/api/drafts/:draft_id*' do
  pass if request.options? || request.get?
  @draft = Draft.find(params.fetch('draft_id'))
  halt 404 unless @draft
  halt 401 unless @draft.commissioner?(@manager)
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

  token = SendLoginToken.perform \
    manager:    manager,
    send_token: !settings.development?

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
  {
    pick: pick.as_json.merge(athlete: pick.athlete),
    on_the_clock: draft.current_team,
    can_pick: @manager.has_next_pick?(draft)
  }.to_json
end

get '/api/drafts' do
  teams = Team.all.select { |team| team.manager_ids.include?(@manager.id) }
  # teams = Team.where(manager_ids: @manager.id) FIXME
  drafts = teams
    .map { |team| team.draft }
    .uniq
    .map { |draft| draft.as_json.merge(is_commissioner: draft.commissioner?(@manager))}

  status 200
  { drafts: drafts }.to_json
end

get '/api/drafts/:draft_id' do
  draft = Draft.find(params.fetch('draft_id'))
  picks = Pick.includes(:athlete).where(draft: draft).order(number: :asc)
  teams = Team.where(draft: draft)

  status 200
  content_type :json
  {
    draft: {
      name: draft.name,
      started: draft.picks.count > 0,
      type: "snake",
      total_rounds: draft.total_rounds,
      teams: teams,
      picks: picks.map { |p| p.as_json.merge(athlete: p.athlete.as_json) },
      positions: {
        "QB"  => 2,
        "RB"  => 2,
        "WR"  => 2,
        "TE"  => 1,
        "K"   => 1,
        "DEF" => 1,
      },
      on_the_clock: draft.current_team,
      can_pick: @manager.has_next_pick?(draft)
    },
    team: @manager.owner_of
  }.to_json
end

put '/api/drafts/:draft_id/order' do
  param :team_ids, Array, required: true

  teams = @draft.teams
  params.fetch('team_ids').each_with_index do |team_id, idx|
    team = teams.detect { |team| team.id == team_id }
    next unless team
    team.update!(ordering: (idx + 1) * -1)
  end
  teams.each { |team| team.update(ordering: team.ordering * -1) }

  status 200
  {
    draft: {
      teams: @draft.reload.teams
    }
  }.to_json
end

def noauth_allowed?
  request.options? ||
    (request.post? && %w(tokens sessions).map { |r| "/api/#{r}" }.include?(request.path_info))
end
