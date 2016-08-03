class CreateTeams < ActiveRecord::Migration
  def change
    create_table :teams do |t|
      t.text :name, null: false
      t.integer :draft_id, null: false
      t.integer :manager_ids, array: true, default: []
      t.timestamps
    end
  end
end
