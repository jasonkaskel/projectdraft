require 'sinatra'
require 'sinatra/param'
require 'sinatra/activerecord'
require 'json'

require './models/athlete'
require './models/draft'
require './models/manager'
require './models/pick'
require './models/team'

set :root, File.dirname(__FILE__)

before '*' do
  content_type :json
  response.headers['Access-Control-Allow-Origin']='*'
end

get '/api/athletes' do
  athletes = Athlete.includes(:pick).all

  athletes_serialized = athletes.map do |athlete|
    athlete.as_json.merge(pick: athlete.pick.as_json)
  end

  status 200
  { athletes: athletes_serialized }.to_json
end

options '/api/picks' do
  response.headers['Access-Control-Allow-Headers'] = ['Content-Type']
  status 204
end

post '/api/picks' do
  param :athlete_id, Integer, required: true
  param :team_id, Integer, required: true

  draft = Draft.first

  pick = Pick.create! \
    draft: draft,
    athlete_id: params.fetch('athlete_id'),
    team_id: params.fetch('team_id'),
    number: draft.current_pick

  status 201
  { pick: pick }.to_json
end

get '/api/' do
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
  while picks.length < 12
    round = picks.length / teams.length + 1
    pick = picks.length % teams.length
    nextTeam =
      if round % 2 == 1
        teams[pick]
      else
        teams[teams.length-1-pick]
      end
    athletes = Athlete.where('average_draft_position < 150')

    Pick.create! \
      number: draft.current_pick,
      team: nextTeam,
      draft: draft,
      athlete: athletes.sample

    picks = Pick.includes(:athlete).where(draft: draft)
  end

  draft = {
    type: "snake",
    teams: teams,
    picks: picks.map { |p| p.as_json.merge(athlete: p.athlete.as_json) }
  }
  status 200
  content_type :json
  { draft: draft }.to_json
end
