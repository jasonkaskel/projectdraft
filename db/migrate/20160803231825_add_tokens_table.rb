class AddTokensTable < ActiveRecord::Migration
  def change
    create_table :tokens do |t|
      t.text :value, null: false
      t.text :token_type, null: false
      t.integer :manager_id, null: false
      t.datetime :expires_at, null: false
      t.timestamps
    end

    add_index :tokens, [:value, :token_type], unique: true
  end
end
