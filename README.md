# Superhero Database

Простий веб-додаток для зберігання та управління інформацією про супергероїв. Реалізовані базові CRUD операції та робота з зображеннями.

## Технології

Backend: Node.js + Nest.js, TypeORM, PostgreSQL, Multer для файлів
Frontend: React, React Router, Axios, Context API

## Що реалізовано

- Створення, редагування та видалення супергероїв
- Додавання та видалення зображень
- Список з пагінацією (5 на сторінку)
- Детальна сторінка з усією інформацією

## Як запустити

Потрібно: Node.js 14+, PostgreSQL 12+, npm

1. Клонування репозиторію та встановлення залежностей:
```bash
git clone <repository-url>
cd SuperHeroes
npm run install:all
```

2. Створення бази даних:
```sql
CREATE DATABASE superheroes_db;
```

3. Створиння `backend/.env`:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=superheroes_db
PORT=3001
UPLOAD_DEST=./uploads
```

4. Запуск backend:
```bash
npm run dev:backend
# або 
cd backend && npm run start:dev
```

5. Запуск frontend:
```bash
npm run dev:frontend
# або 
cd frontend && npm start
```

Відкрити `http://localhost:3000`

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

## API

`GET /api/superheroes?page=1&limit=5` - список
`GET /api/superheroes/:id` - деталі
`POST /api/superheroes` - створити
`PATCH /api/superheroes/:id` - оновити
`DELETE /api/superheroes/:id` - видалити

`POST /api/superheroes/:id/images` - додати зображення (multipart/form-data)
`DELETE /api/superheroes/:id/images/:imageId` - видалити зображення

## Тести

```bash
cd backend && npm test
cd frontend && npm test
```

## Припущення

- PostgreSQL для БД (локальна для розробки)
- Зображення зберігаються в `backend/uploads/`, формати: JPG, PNG, GIF (макс 5MB)
- CORS налаштований для localhost:3000
- Пагінація: 5 елементів за замовчуванням
- TypeORM `synchronize: true` тільки для розробки 

## Технічні рішення

Використав Context API замість Redux - простіше для такого проекту. Асинхронні операції через async/await з обробкою помилок. Валідація на backend через class-validator. Зображення поки локально.

