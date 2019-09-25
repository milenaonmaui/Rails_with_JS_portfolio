class CruiseSerializer < ActiveModel::Serializer
  attributes :id, :name, :seats_left, :price_child, :price_adult, :min_age
  belongs_to :category
  has_many :bookings
end
