class AddTotalRoundsToDraft < ActiveRecord::Migration
  def change
    add_column :drafts, :total_rounds, :integer, default: 15
  end
end
