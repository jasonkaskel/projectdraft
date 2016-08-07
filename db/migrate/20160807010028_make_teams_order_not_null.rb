class MakeTeamsOrderNotNull < ActiveRecord::Migration
  def change
    change_column_null :teams, :order, false
  end
end
