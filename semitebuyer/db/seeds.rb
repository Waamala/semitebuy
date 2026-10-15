# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with bin/rails db:seed (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: "Star Wars" }, { name: "Lord of the Rings" }])
#   Character.create(name: "Luke", movie: movies.first)

# Create demo accounts (idempotent — only if missing)
demo_users = [
  { first_name: "Иван",   last_name: "Петров",    email: "ivan.test@example.com",    role: "organizer", password: "password123" },
  { first_name: "Анна",   last_name: "Смирнова",  email: "anna.buyer@example.com",    role: "buyer",     password: "password123" },
  { first_name: "Мария",  last_name: "Козлова",    email: "maria.organizer@example.com", role: "organizer", password: "password123" }
]

demo_users.each do |attrs|
  u = User.find_or_initialize_by(email: attrs[:email])
  u.assign_attributes(attrs.except(:email))
  u.skip_confirmation!
  u.save! if u.changed?
  puts "user ready: #{u.email} (#{u.role})"
end
