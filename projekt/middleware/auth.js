// Подключаем библиотеку jsonwebtoken (проверяет токен (ключ) подтверждая, что пользователь в системе)
const jwt = require("jsonwebtoken");

// В .env у нас хранится секретный ключ для токенов (JWT_SECRET)
require("dotenv").config();

// Создаём функцию authenticateToken — она проверяет, есть ли у пользователя токен и правильный ли он
// req — это запрос от пользователя, res — это ответ
// next — это команда "продолжить", чтобы передать запрос дальше
const authenticateToken = (req, res, next) => {
  // Проверяем, есть ли в запросе заголовок "authorization" (там должен быть токен)
  // Мы берём только вторую часть (токен), для проверки
  const token = req.headers["authorization"]?.split(" ")[1];

  // 401 — это код ошибки, который означает "нет доступа"
  if (!token) return res.status(401).json({ message: "Токен отсутствует" });

  // jwt.verify проверяет токен с помощью секретного ключа (JWT_SECRET из .env)
  // Если токен правильный, мы получаем данные пользователя (user)
  // Если токен неправильный, получаем ошибку (err)
  const secret = process.env.JWT_SECRET

  //console.log("Token received:", token);
  jwt.verify(token, secret, (err, user) => {
  if (err) {
    return res.status(403).json({ message: "Недействительный токен" });
  }
  
    req.user = user;
    next();
  });
};

// Экспортируем две функции, чтобы их можно было использовать в других файлах
module.exports = { authenticateToken };