require 'rack'
require 'rack/contrib'
require './projectdraft'

static_urls = [
  "/login",
  "/drafts/1",
  "/drafts/1/picks",
  "/drafts/1/commish",
  "/drafts/1/commish/order"
]

use Rack::PostBodyContentTypeParser
use Rack::Static, urls: static_urls.reduce({}) { |hsh, url| hsh.merge(url => "index.html") }, root: 'public', index: 'index.html'

run Sinatra::Application
