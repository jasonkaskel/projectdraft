port = ENV['PORT'] || 3001
bind "tcp://0.0.0.0:#{port}"
workers 2
