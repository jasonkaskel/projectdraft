class CreateManagers < ActiveRecord::Migration
  def change
    create_table :managers do |t|
      t.text :email
      t.integer :cell
      t.timestamps
    end

    add_index :managers, :email, unique: true
    add_index :managers, :cell, unique: true
  end
end
