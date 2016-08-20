require 'rack'
require 'rack/contrib'
require './projectdraft'

use Rack::PostBodyContentTypeParser
use Rack::Static, urls: {"/login" => "index.html", "/drafts/1" => "index.html", "/drafts/1/picks" => "index.html"}, root: 'public', index: 'index.html'

run Sinatra::Application
