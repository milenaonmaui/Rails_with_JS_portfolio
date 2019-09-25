class BookingSerializer < ActiveModel::Serializer
  attributes :id, :num_adults, :num_children, :created_at, :cruise
  def cruise
    self.object.cruise.name
  end
end
