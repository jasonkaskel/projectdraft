class AddOrderToTeams < ActiveRecord::Migration
  def change
    add_column :teams, :order, :integer
    add_index :teams, :order, unique: true
  end
end
