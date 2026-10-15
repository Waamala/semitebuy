class ApplicationController < ActionController::Base
  # Only allow modern browsers supporting webp images, web push, badges, import maps, CSS nesting, and CSS :has.
  allow_browser versions: :modern

  before_action :configure_permitted_parameters, if: :devise_controller?

  # Use a minimal "auth" layout for Devise screens (login / register / etc.)
  layout :layout_by_resource

  private

  def layout_by_resource
    if devise_controller?
      "auth"
    else
      "application"
    end
  end

  protected

  # Allow extra profile fields on Devise forms (sign up + account update).
  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(
      :sign_up,
      keys: %i[first_name last_name phone city role_choice]
    )

    devise_parameter_sanitizer.permit(
      :account_update,
      keys: %i[first_name last_name phone city about]
    )
  end
end
