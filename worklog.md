# Worklog — semitebuyer (Rails UI Kit + Auth)

---
Task ID: 1
Agent: main (super-z)
Task: Создать UI kit + авторизацию для Rails-приложения «semitebuyer» — платформы совместных закупок. Проект чисто на Ruby (Rails 7 + Hotwire, без JS-фреймворков).

Work Log:
- Проверил окружение: Ruby/Rails отсутствовали, не было sudo. Установил через rbenv + ruby-build локально в /home/z/.rbenv (собрал libyaml из исходников в /home/z/.local для psych-расширения, потому что libyaml-dev недоступен).
- Установил Ruby 3.3.12 + Rails 7.2.2 + Devise 5.0.4 + tailwindcss-rails 4.6 + sqlite3.
- Создал новый Rails 7 проект в /home/z/my-project/semitebuyer с --css=tailwind --database=sqlite3.
- Обнаружил конфликт: env-переменная `DATABASE_URL=file:...` переопределяла database.yml. Добавил фикс в config/application.rb (удаляет DATABASE_URL с "file:" адаптером).
- Сгенерировал Devise User model, расширил миграцию: добавил first_name, last_name, phone, city, about, role (default "buyer") + confirmable fields.
- Настроил User model: 2 роли (buyer/organizer), виртуальный атрибут `role_choice` + before_validation, методы buyer?/organizer?/display_name/initials.
- Настроил ApplicationController: layout_by_resource (auth layout для devise, application для остального) + configure_permitted_parameters (first_name, last_name, phone, city, role_choice, about).
- Создал дизайн-систему Tailwind 4 через `@theme` и `@utility`:
  - Палитра: terra (терракота 50-700), cream (50-200), ink (300-900), success/warning/danger/info.
  - Шрифт: Manrope (через Google Fonts).
  - Компоненты: sb-btn--primary/secondary/ghost/danger (+sm/lg), sb-input, sb-input--error, sb-label, sb-hint, sb-error, sb-card (+pad/lifted), sb-badge--* (6 цветов), sb-alert--* (4 цвета), sb-nav-link, sb-progress, sb-check/sb-radio, sb-auth-card.
- Создал layouts: application.html.erb (navbar + footer + flash), auth.html.erb (минимальный topbar + centered card).
- Создал shared partials: _navbar (с dropdown user-menu через Stimulus), _footer.
- Создал Stimulus controller: dropdown_controller.js (toggle + outside-click).
- Сгенерировал и стилизовал Devise views:
  - sessions/new (login с remember-me + forgot-password link)
  - registrations/new (sign up с именем, телефоном, городом, выбором роли через card-based radio, password + confirmation, terms checkbox)
  - registrations/edit (profile edit + delete account section)
  - passwords/new + passwords/edit (forgot + reset)
  - confirmations/new (resend confirmation)
  - Добавил inline errors в registration form (sb-alert--danger)
- Создал PagesController#home (landing с hero, stats, how-it-works, CTA).
- Создал UiKitController#index (демо-страница /ui_kit со всеми компонентами: палитра, кнопки, бейджи, алерты, формы, карточки, прогресс-бары, навигация, auth form preview).
- Создал DashboardController#index (authenticated, показывает профиль + stats + status confirmed/unconfirmed).
- Настроил routes: root → pages#home, /ui_kit, /dashboard, devise_for :users.
- Создал I18n: config/locales/ru.yml — все Devise messages + activerecord attributes + errors на русском.
- Поймал и пофиксил 2 критических бага:
  1. `json 3.1.0` убрал `quirks_mode` → Rails 7.2 падал при commit_session. Зафиксировал `gem "json", "~> 2.7"` в Gemfile.
  2. Turbo Stream ломал Devise редиректы после login (URL оставался /users/sign_in). Добавил `data: { turbo: false }` ко всем Devise-формам.
- Доработал before_validation для role: переписал так, чтобы `role` можно было задавать напрямую (для seeds), а `role_choice` применялся только если он явно передан (из формы).
- Создал seeds.rb с 3 демо-аккаунтами (ivan=organizer, anna=buyer, maria=organizer), skip_confirmation!.
- Прогнал сквозной auth flow через Playwright: register → login (unconfirmed, 401) → confirm via rails runner → login (success, redirect to /) → dashboard (200). Все скриншоты в /home/z/my-project/download/.
- Сделал визуальный QA через сабагента (Read на PNG): подтверждено, что тёплый терракота+кремовый стиль корректно применён на всех 4 страницах (home, ui_kit, sign_in, sign_up), layout чистый, формы полированы.

Stage Summary:
- Артефакт: полный Rails 7 проект в /home/z/my-project/semitebuyer/ (запускается через `bin/rails server` или `bin/dev`).
- Скриншоты: /home/z/my-project/download/{home,ui_kit,sign_in,sign_up,flow_*}.png
- Демо-аккаунты: ivan.test@example.com / anna.buyer@example.com / maria.organizer@example.com (пароль: password123)
- Рабочие маршруты: /, /ui_kit, /users/sign_in, /users/sign_up, /users/edit, /users/password/new, /users/confirmation/new, /dashboard
- UI Kit включает: кнопки (4 variants × 3 sizes), инпуты (с error state), лейблы/хинты, карточки (3 variants), бейджи (6 цветов), алерты (4 цвета), навигацию, прогресс-бары, чекбоксы/радио, auth-карточку.
- Auth включает: Devise с confirmable + recoverable + rememberable + validatable, роли buyer/organizer, локализация на русский, кастомные формы под UI Kit.
- Документация: README.md с инструкцией запуска, таблицей маршрутов, описанием дизайн-системы, ролями и дальнейшими шагами.
- Следующие шаги для пользователя: модели предметной области (Purchase, Participant, Order, Payment, Refund), CRUD закупок, live-интерфейс через Turbo Streams + Action Cable, платёжная система.
