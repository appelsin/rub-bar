class StupidCache
  @data = {}
  @timestamp = {}
  @expire = 60

  def self.get(key)
    (Time.now.to_i - (@timestamp[key]||0)) < @expire ? @data[key] : nil
  end

  def self.set(key, data)
    @timestamp[key] = Time.now.to_i
    @data[key] = data
    data
  end

  def self.fetch(key, &block)
    result = self.get key
    if result.nil?
      self.set key, block.call
    else
      result
    end
  end
end
