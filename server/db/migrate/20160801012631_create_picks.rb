class CreatePicks < ActiveRecord::Migration
  def change
    create_table :picks do |t|
      t.integer :number, null: false
      t.integer :team_id, null: false
      t.integer :draft_id, null: false
      t.integer :athlete_id, null: false
      t.timestamps
    end

    add_index :picks, [:number, :draft_id], unique: true
    add_index :picks, [:athlete_id, :draft_id], unique: true
  end
end
