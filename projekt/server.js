const express = require("express");
const db = require("./config/database");
const authRoutes = require("./routes/auth");
const articleRoutes = require("./routes/articles");
const commentRoutes = require("./routes/comments");

const cors = require('cors');

// Создаём приложение (сервер) с помощью express
// app — это сервер, который будет обрабатывать запросы

const app = express();

// Настраиваем сервер, чтобы он понимал JSON
// Это нужно, чтобы сервер мог принимать данные в формате JSON, например, { "username": "student123", "password": "123" }
app.use(cors({ origin: 'http://localhost:3002' }));

app.use(express.json());

// Все запросы, которые начинаются с /auth (например, /auth/register & /auth/login), будут обрабатываться кодом из authRoutes
app.use("/auth", authRoutes);

app.use("/articles", articleRoutes);

app.use("/comments", commentRoutes);

// Указываем порт, на котором будет работать сервер
const PORT = 3001;

// Синхронизируем базу данных и запускаем сервер
// db.sync({ force: true }) — синхронизирует модели (таблицы) с базой данных
// force: true означает, что таблицы будут пересозданы (все данные удалятся!)
// Если не хочешь удалять данные, убери { force: true }
db.sync()
  .then(() => {
  // После успешной синхронизации запускаем сервер
  // app.listen(PORT, ...) — запускает сервер на указанном порту (3001)
  app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
  });
}).catch((err) => {
  console.error("Ошибка подключения к БД: ", err);
});