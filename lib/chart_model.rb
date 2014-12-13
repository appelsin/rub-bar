class ChartModel
  def self.get_rub_bar
    a = Ox.parse Net::HTTP.get('news.yandex.ru', '/quotes/graph_1.xml')
    b = Ox.parse Net::HTTP.get('news.yandex.ru', '/quotes/graph_1006.xml')

    usd = {
        time: a.series.x.nodes.first.split(';').map { |v| v.to_i },
        val: a.series.y.nodes.first.split(';').map { |v| v.to_f.round }
    }

    oil = {
        time: b.series.x.nodes.first.split(';').map { |v| v.to_i },
        val: b.series.y.nodes.first.split(';').map { |v| v.to_f.round }
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
