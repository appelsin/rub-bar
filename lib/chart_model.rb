require 'net/http'
require 'json'

class ChartModel
  def self.get_rub_bar
    a = JSON.parse Net::HTTP.get_response("news.yandex.ru", "/quotes/graph_1.json").body
    b = JSON.parse Net::HTTP.get_response("news.yandex.ru", "/quotes/graph_1006.json").body

    usd = {
        time: a['prices'].map { |v| v[0] },
        val: a['prices'].map { |v| v[1] }
    }

    oil = {
        time: b['prices'].map { |v| v[0] },
        val: b['prices'].map { |v| v[1] }
    }

    oil_rub = {time: [], val: []}

    j = 0 # exchange rate for current time
    usd_exc_rate = usd[:val][0]
    oil[:time].each_with_index do |time, i|
      while ((time > usd[:time][j+1]) rescue false)
        j+= 1
        usd_exc_rate = usd[:val][j]
      end

      oil_rub[:time] << time
      oil_rub[:val] << usd_exc_rate * oil[:val][i] rescue 0
    end

    oil_rub
  end
end
