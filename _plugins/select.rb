require "rubygems"
require "json"

module SelectFilter
def select(input, *selected)
    return [] if input.nil?
    input.map{ |o| o.to_liquid.hash_for_json.reject! { |k| not selected.include? k } }
end
Liquid::Template.register_filter self
end
