class RenameTeamsOrderToOrdering < ActiveRecord::Migration
  def change
    rename_column :teams, :order, :ordering
  end
end
