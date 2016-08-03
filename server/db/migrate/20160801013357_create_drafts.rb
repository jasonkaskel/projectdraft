class CreateDrafts < ActiveRecord::Migration
  def change
    create_table :drafts do |t|
      t.text :name, null: false
      t.integer :commissioner_ids, array: true, default: []
      t.timestamps
    end
  end
end
