require 'rack'
require 'rack/contrib'
require './projectdraft'

use Rack::PostBodyContentTypeParser
use Rack::Static, :urls => {"/login" => "index.html", "/pick" => "/index.html", "/board" => "/index.html"}, :root => 'public', :index => 'index.html'

run Sinatra::Application
