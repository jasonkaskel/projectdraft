class AddIndexAthletesAverageDraftPosition < ActiveRecord::Migration
  def change
    add_index :athletes, :average_draft_position
  end
end
