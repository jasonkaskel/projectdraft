require 'faraday'
require 'json'

def write_json(obj)
  File.open("/Users/jasonkaskel/Personal/workspace/projectdraft/data/#{obj.first['Team']}.json", 'w') { |f| f.write(JSON.pretty_generate(obj)) }
end

def get_players(team)
  conn = Faraday.new('https://api.fantasydata.net')
  response = conn.get { |req| req.url "/nfl/v2/JSON/Players/#{team}"; req.headers['Ocp-Apim-Subscription-Key']='ea864b5ed6df469babcb7005cb5f1603' }
  response.body
end

def parse_team(str)
  team = JSON.parse(str)
  include_keys=%w[Team FirstName LastName Position FantasyPosition Active Name PhotoUrl ByeWeek ShortName AverageDraftPosition YahooPlayerID]
  team.map { |player| player.slice(*include_keys) }
end

teams = ["ARI","ATL","BAL", "BUF", "CAR", "CHI", "CIN", "CLE", "DAL", "DEN", "DET", "GB", "HOU", "IND", "JAX", "KC", "LA", "MIA", "MIN", "NE", "NO", "NYG", "NYJ", "OAK", "PHI", "PIT", "SD", "SEA", "SF", "TB", "TEN", "WAS"]

teams.each {|team| write_json(parse_team(get_players(team))) }
