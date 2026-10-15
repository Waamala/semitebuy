class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :confirmable

  # Roles for the two-sided marketplace
  ROLES = %w[buyer organizer].freeze

  validates :first_name, presence: true, length: { maximum: 50 }
  validates :last_name,  presence: true, length: { maximum: 50 }
  validates :role,       presence: true, inclusion: { in: ROLES }

  # Virtual attribute used by the registration form to pick a role.
  attr_accessor :role_choice

  before_validation :set_role_from_choice, on: :create

  # ---- Role checks ----
  def buyer?
    role == "buyer"
  end

  def organizer?
    role == "organizer"
  end

  def display_name
    [first_name, last_name].reject(&:blank?).join(" ").presence || email
  end

  def initials
    "#{first_name.to_s.first}#{last_name.to_s.first}".upcase.presence || "U"
  end

  private

  # Apply role_choice ONLY when it's explicitly set (form context).
  # Bulk-assigning `role` directly should not be overwritten.
  def set_role_from_choice
    self.role = role_choice if role_choice.present?
  end
end
