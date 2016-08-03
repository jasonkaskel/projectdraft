class Athletes < ActiveRecord::Migration
  def change
    create_table :athletes do |t|
      t.text :team, null: false
      t.text :first_name, null: false
      t.text :last_name, null: false
      t.text :name, null: false
      t.text :short_name
      t.text :position, null: false
      t.text :photo_url, null: false
      t.integer :bye_week
      t.float :average_draft_position
      t.integer :yahoo_player_id
      t.timestamps
    end
  end
end
