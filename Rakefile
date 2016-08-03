require 'sinatra/activerecord/rake'

namespace :db do
  task :load_config do
    require './projectdraft'
  end
end

Dir.glob('./lib/tasks/**/*.rake').each { |r| import r }
