# semitebuyer

Платформа совместных закупок на Ruby on Rails 7.
UI Kit + авторизация (Devise) с тёплым маркетплейс-стилем (терракота + кремовый).

## Стек

- **Ruby** 3.3, **Rails** 7.2
- **Hotwire** (Turbo + Stimulus)
- **Tailwind CSS 4** (CSS-first конфигурация через `@utility`)
- **Devise** (database_authenticatable + registerable + recoverable + rememberable + **confirmable**)
- **SQLite3** (для разработки)
- **Manrope** (шрифт, подключён через Google Fonts)

## Запуск

```bash
# Установить зависимости
bundle install

# Подготовить БД
bin/rails db:create db:migrate db:seed

# Запуск dev-сервера (с watch Tailwind)
bin/dev

# Или просто rails-сервер (CSS уже собран)
bin/rails server
```

Откройте http://localhost:3000

## Демо-аккаунты (после `db:seed`)

| Email                          | Пароль        | Роль         |
|--------------------------------|---------------|--------------|
| ivan.test@example.com          | password123   | organizer    |
| anna.buyer@example.com         | password123   | buyer        |
| maria.organizer@example.com     | password123   | organizer    |

Все аккаунты уже подтверждены через `skip_confirmation!` в `db/seeds.rb`.

## Страницы

| URL                    | Описание                                    |
|------------------------|---------------------------------------------|
| `/`                    | Публичная главная (hero + how-it-works)      |
| `/ui_kit`              | Styleguide всех UI-компонентов               |
| `/users/sign_up`       | Регистрация с выбором роли (buyer/organizer) |
| `/users/sign_in`       | Вход                                        |
| `/users/edit`          | Редактирование профиля (требует логина)     |
| `/users/password/new` | Восстановление пароля                        |
| `/users/confirmation/new` | Повторная отправка письма подтверждения   |
| `/dashboard`           | Личный кабинет (требует логина)             |

## Структура UI Kit

Дизайн-система находится в `app/assets/tailwind/application.css` и определяет:

**Цвета:**
- `terra-*` — терракота (primary, 50–700)
- `cream-*` — кремовый фон (50–200)
- `ink-*` — тёмный текст (300–900)
- `success / warning / danger / info` — статусы

**Компоненты (через `@utility`):**

| Класс                  | Назначение                                       |
|------------------------|--------------------------------------------------|
| `sb-btn--primary`      | Основная кнопка (терракота, белый текст)         |
| `sb-btn--secondary`    | Вторичная (кремовый фон, терракотовый текст)     |
| `sb-btn--ghost`        | Призрачная (прозрачный фон)                      |
| `sb-btn--danger`       | Опасная (красный)                                |
| `sb-btn--sm / --lg`    | Размеры                                          |
| `sb-input`             | Поле ввода (focus state + error state)           |
| `sb-input--error`      | Поле с ошибкой валидации                          |
| `sb-label / sb-hint / sb-error` | Подпись / подсказка / ошибка            |
| `sb-card / sb-card--pad / sb-card--lifted` | Карточка и её варианты   |
| `sb-badge--*`          | Бейджи 6 цветов                                  |
| `sb-alert--*`          | Алерты 4 цветов (info/success/warning/danger)    |
| `sb-nav-link / --active` | Пункт навигации                                |
| `sb-progress / __bar`  | Прогресс-бар (для статуса закупки)               |
| `sb-check / sb-radio`  | Чекбокс / радио                                  |
| `sb-auth-card`         | Карточка auth-формы (центрированная, с тенью)    |

## Роли пользователей

User model имеет поле `role` (`buyer` или `organizer`):

```ruby
user.buyer?      # true если role == 'buyer'
user.organizer?  # true если role == 'organizer'
user.display_name # "Иван Петров" (или email, если имён нет)
user.initials    # "ИП" — для аватарок
```

В форме регистрации роль выбирается через `role_choice` (виртуальный атрибут), который через `before_validation` копируется в `role`. Это позволяет форме решать роль, а seed и другим скриптам — задавать её напрямую через `role:`.

## Конфигурация

- `config/application.rb` — установлены `time_zone = "Moscow"`, `i18n.default_locale = :ru`, и фикс для `DATABASE_URL=file:...` (некоторые хостинги прокидывают неподдерживаемый adapter).
- `config/initializers/devise.rb` — включены confirmable + recoverable + rememberable + validatable.
- `config/locales/ru.yml` — все тексты Devise и ActiveRecord на русском.
- `Gemfile` — добавлен `gem "json", "~> 2.7"` (pin, т.к. `json 3.x` убрал `quirks_mode`, который использует Rails 7.2).

## Stimulus controllers

- `app/javascript/controllers/dropdown_controller.js` — выпадающее меню (используется в navbar для user menu)

## Известные особенности

1. **Turbo отключён для Devise-форм** (`data-turbo="false"`). Devise + Turbo Stream имеют известные конфликты при редиректах после submit. Это безопасный дефолт; если захотите вернуть Turbo — добавьте `responders` и `turbo_stream` views.
2. **Письма подтверждения не отправляются в dev**. ActionMailer по умолчанию ничего не доставляет; письма видны в `log/development.log`. В seeds пользователи создаются уже подтверждёнными через `skip_confirmation!`.
3. **Tailwind 4 (CSS-first)**. Конфигурация через `@theme` и `@utility` в `app/assets/tailwind/application.css`. `tailwind.config.js` не используется.

## Дальнейшие шаги

После UI kit и auth логично делать дальше:

1. **Модели предметной области**: `Purchase`, `PurchaseParticipant`, `Order`, `Payment`, `Refund`.
2. **CRUD закупок** для роли organizer с UI kit.
3. **Live-интерфейс сбора участников** (Turbo Streams + Action Cable).
4. **Подключение платёжной системы** (YooKassa / Tinkoff / Robokassa).
5. **Крон-задачи** для авто-рефандов при неудаче закупки.
6. **ActionMailer** для реальной отправки писем (devise confirmations, password resets, уведомления о закупках).
