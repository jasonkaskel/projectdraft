require './projectdraft'
require './models/athlete'

namespace :run_once do
  desc 'import athletes into database'
  task :import_athletes do

    DATA_PATH = '../data'
    positions = %w(QB WR RB TE K DEF)
    Dir.foreach(DATA_PATH) do |filename|
      next if filename.start_with?('.')
      next if filename.start_with?('team')

      file = File.read("#{DATA_PATH}/#{filename}")
      team = JSON.parse(file)

      team.each do |player|
        next unless player['Active']
        next unless player['AverageDraftPosition']
        next unless positions.include?(player['Position'])

        Athlete.create! \
          team: player['Team'],
          first_name: player['FirstName'],
          last_name: player['LastName'],
          name: player['Name'],
          short_name: player['ShortName'],
          position: player['Position'],
          photo_url: player['PhotoUrl'],
          bye_week: player['ByeWeek'],
          average_draft_position: player['AverageDraftPosition'],
          yahoo_player_id: player['YahooPlayerID']
      end
      Athlete.create! \
        team: team.first['Team'],
        first_name: team.first['Team'],
        last_name: team.first['Team'],
        name: team.first['Team'],
        position: 'DEF',
        photo_url: 'a',
        bye_week: team.first['ByeWeek']
    end
  end
end
