class Cruise < ApplicationRecord
    belongs_to :category
    has_many :bookings
    has_many :users, through: :bookings
    validates :name, presence: true
end
