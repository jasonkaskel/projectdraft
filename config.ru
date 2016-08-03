require 'rack'
require 'rack/contrib'
require './projectdraft'

use Rack::PostBodyContentTypeParser

use Rack::Static, :urls => {"/" => "index.html"}, :root => 'public', :index => 'index.html'
run Sinatra::Application
