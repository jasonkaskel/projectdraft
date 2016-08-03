require 'rack'
require 'rack/contrib'
require './projectdraft'

use Rack::PostBodyContentTypeParser
run Sinatra::Application
