# Superhero Database Web Application

Веб-додаток для управління базою даних супергероїв з можливістю виконання CRUD операцій.

## Технологічний стек

### Backend
- **Node.js** з фреймворком **Nest.js**
- **TypeORM** для роботи з базою даних
- **PostgreSQL** як база даних
- **Multer** для завантаження файлів

### Frontend
- **React** з React Router
- **Axios** для HTTP запитів
- **Context API** для управління станом

## Функціональні можливості

✅ **CRUD операції з супергероями:**
- Створення нового супергероя
- Редагування існуючого супергероя
- Видалення супергероя
- Перегляд деталей супергероя

✅ **Управління зображеннями:**
- Додавання зображень до супергероя
- Видалення зображень з супергероя
- Відображення зображень у списку та деталях

✅ **Список супергероїв:**
- Пагінація (5 елементів на сторінку)
- Відображення одного зображення та nickname для кожного супергероя

## Встановлення та запуск

### Передумови

- Node.js (версія 14 або вище)
- PostgreSQL (версія 12 або вище)
- npm або yarn

### Крок 1: Клонування репозиторію

```bash
git clone <repository-url>
cd SuperHeroes
```

### Крок 2: Встановлення залежностей

Встановіть залежності для всього проекту:

```bash
npm run install:all
```

Або встановіть окремо:

```bash
# Коренева директорія
npm install

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### Крок 3: Налаштування бази даних

1. Створіть базу даних PostgreSQL:

```sql
CREATE DATABASE superheroes_db;
```

2. Налаштуйте змінні оточення для backend. Створіть файл `backend/.env`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=superheroes_db
PORT=3001
UPLOAD_DEST=./uploads
```

### Крок 4: Запуск додатку

#### Запуск Backend

```bash
# З кореневої директорії
npm run dev:backend

# Або з директорії backend
cd backend
npm run start:dev
```

Backend буде доступний на `http://localhost:3001`

#### Запуск Frontend

В новому терміналі:

```bash
# З кореневої директорії
npm run dev:frontend

# Або з директорії frontend
cd frontend
npm start
```

Frontend буде доступний на `http://localhost:3000`

### Крок 5: Відкрити додаток

Відкрийте браузер і перейдіть на `http://localhost:3000`

## Структура проекту

```
SuperHeroes/
├── backend/              # Nest.js backend
│   ├── src/
│   │   ├── superhero/   # Модуль супергероїв
│   │   │   ├── dto/     # Data Transfer Objects
│   │   │   ├── entities/ # TypeORM entities
│   │   │   ├── superhero.controller.ts
│   │   │   ├── superhero.service.ts
│   │   │   └── superhero.module.ts
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── uploads/         # Завантажені зображення
│   └── package.json
├── frontend/            # React frontend
│   ├── src/
│   │   ├── components/  # React компоненти
│   │   ├── context/     # Context API для стану
│   │   └── App.js
│   └── package.json
└── package.json         # Root package.json
```

## API Endpoints

### Superheroes

- `GET /api/superheroes` - Отримати список супергероїв (з пагінацією)
  - Query params: `page`, `limit` (за замовчуванням: page=1, limit=5)
- `GET /api/superheroes/:id` - Отримати деталі супергероя
- `POST /api/superheroes` - Створити нового супергероя
- `PATCH /api/superheroes/:id` - Оновити супергероя
- `DELETE /api/superheroes/:id` - Видалити супергероя

### Images

- `POST /api/superheroes/:id/images` - Додати зображення до супергероя
  - Body: `multipart/form-data` з полем `image`
- `DELETE /api/superheroes/:id/images/:imageId` - Видалити зображення

## Тестування

### Backend тести

```bash
cd backend
npm test
```

### Frontend тести

```bash
cd frontend
npm test
```

## Припущення та рішення

### Припущення

1. **База даних**: Використовується PostgreSQL. Для розробки можна використовувати локальну базу даних.

2. **Зображення**: 
   - Зображення зберігаються локально в директорії `backend/uploads/`
   - Підтримуються формати: JPG, JPEG, PNG, GIF
   - Максимальний розмір файлу: 5MB

3. **CORS**: Backend налаштований для прийняття запитів з `http://localhost:3000`

4. **Пагінація**: За замовчуванням показується 5 елементів на сторінку

5. **TypeORM Synchronize**: У режимі розробки `synchronize: true` для автоматичного створення таблиць. **УВАГА**: Не використовуйте це у продакшені!

### Технічні рішення

1. **State Management**: Використовується React Context API замість Redux для спрощення архітектури та меншої кількості залежностей.

2. **Async Operations**: Всі асинхронні операції обробляються через async/await в Context API з належною обробкою помилок.

3. **Компоненти**: 
   - `SuperheroList` - список з пагінацією
   - `SuperheroDetail` - детальна інформація про супергероя
   - `SuperheroForm` - форма для створення/редагування

4. **Валідація**: Використовується `class-validator` на backend для валідації даних.

5. **Файлова система**: Зображення зберігаються локально. У продакшені рекомендується використовувати cloud storage (AWS S3, Cloudinary тощо).

## Можливі покращення

- [ ] Додати автентифікацію та авторизацію
- [ ] Реалізувати пошук та фільтрацію супергероїв
- [ ] Додати можливість сортування
- [ ] Покращити обробку помилок на frontend
- [ ] Додати loading states для кращого UX
- [ ] Реалізувати оптимізацію зображень (resize, compression)
- [ ] Додати E2E тести
- [ ] Використати cloud storage для зображень у продакшені

## Автор

Розроблено як тестове завдання для створення бази даних супергероїв.
