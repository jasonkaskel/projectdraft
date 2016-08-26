require './projectdraft'
require './models/draft'
require './concerns/send_login_token'

desc 'send login links to a draft'
task :send_links_to_draft, [:draft_id] do |t, args|
  draft_id = args[:draft_id].to_i

  draft = Draft.find(draft_id)
  managers = draft.teams.map(&:owner).compact

  managers.each do |manager|
    SendLoginToken.perform \
      manager:    manager,
      send_token: true,
      expires_at: 30.minutes.from_now
  end
end
