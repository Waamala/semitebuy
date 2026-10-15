Rails.application.routes.draw do
  devise_for :users

  # Personal dashboard (requires authentication; Devise redirects to sign_in if not logged in)
  get "dashboard", to: "dashboard#index", as: :dashboard

  # Public landing & UI kit demo
  root "pages#home"
  get "ui_kit", to: "ui_kit#index", as: :ui_kit

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  get "up" => "rails/health#show", as: :rails_health_check

  # Render dynamic PWA files from app/views/pwa/*
  get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker
  get "manifest" => "rails/pwa#manifest", as: :pwa_manifest
end
