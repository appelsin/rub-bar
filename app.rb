require 'net/http'
require 'sinatra/json'
require_relative 'lib/stupid_cache'
require_relative 'lib/chart_model'

get '/' do
  slim :chart #, layout: :app
end

get '/chart/rub_bar.json' do
  result_json = StupidCache.fetch :rub_bar do
    result_data = StupidCache.fetch :rub_bar do
      ChartModel.get_rub_bar
    end
    Oj.dump(result_data, mode: :compat)
  end

  content_type 'application/json'
  result_json
end
