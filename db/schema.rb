# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20160820190257) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "athletes", force: :cascade do |t|
    t.text     "team",                   null: false
    t.text     "first_name",             null: false
    t.text     "last_name",              null: false
    t.text     "name",                   null: false
    t.text     "short_name"
    t.text     "position",               null: false
    t.text     "photo_url",              null: false
    t.integer  "bye_week"
    t.float    "average_draft_position"
    t.integer  "yahoo_player_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "drafts", force: :cascade do |t|
    t.text     "name",                          null: false
    t.integer  "commissioner_ids", default: [],              array: true
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "total_rounds",     default: 15
  end

  create_table "managers", force: :cascade do |t|
    t.text     "email"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.text     "cell"
    t.index ["cell"], name: "index_managers_on_cell", unique: true, using: :btree
    t.index ["email"], name: "index_managers_on_email", unique: true, using: :btree
  end

  create_table "picks", force: :cascade do |t|
    t.integer  "number",     null: false
    t.integer  "team_id",    null: false
    t.integer  "draft_id",   null: false
    t.integer  "athlete_id", null: false
    t.datetime "created_at"
    t.datetime "updated_at"
    t.index ["athlete_id", "draft_id"], name: "index_picks_on_athlete_id_and_draft_id", unique: true, using: :btree
    t.index ["number", "draft_id"], name: "index_picks_on_number_and_draft_id", unique: true, using: :btree
  end

  create_table "teams", force: :cascade do |t|
    t.text     "name",                     null: false
    t.integer  "draft_id",                 null: false
    t.integer  "manager_ids", default: [],              array: true
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "order",                    null: false
    t.integer  "owner_id"
    t.index ["order"], name: "index_teams_on_order", unique: true, using: :btree
  end

  create_table "tokens", force: :cascade do |t|
    t.text     "value",      null: false
    t.text     "token_type", null: false
    t.integer  "manager_id", null: false
    t.datetime "expires_at", null: false
    t.datetime "created_at"
    t.datetime "updated_at"
    t.index ["value", "token_type"], name: "index_tokens_on_value_and_token_type", unique: true, using: :btree
  end

end
