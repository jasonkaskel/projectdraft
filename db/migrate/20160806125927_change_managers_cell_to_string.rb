class ChangeManagersCellToString < ActiveRecord::Migration
  def change
    remove_index :managers, :cell
    remove_column :managers, :cell, :integer
    add_column :managers, :cell, :text
    add_index :managers, :cell, unique: true
  end
end
