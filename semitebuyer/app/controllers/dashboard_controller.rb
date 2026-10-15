class DashboardController < ApplicationController
  before_action :authenticate_user!

  def index
    # Personal dashboard for the signed-in user
  end
end
