// Подключаем библиотеку express — она нужна для создания маршрутов API
const express = require("express");

// Подключаем библиотеку bcryptjs — она нужна для шифрования паролей (чтобы хранить их безопасно)
const bcrypt = require("bcryptjs");

// Подключаем библиотеку jsonwebtoken (jwt) — она нужна для создания токенов (чтобы подтверждать, что пользователь вошёл в систему)
const jwt = require("jsonwebtoken");

const { User } = require("../models");

// Создаём маршрутизатор с помощью express (папка для маршрутов регистраций и входов)
const router = express.Router();

// В .env у нас хранится секретный ключ для токенов (JWT_SECRET)
require("dotenv").config();

// Создаём маршрут POST /register — он нужен для регистрации нового пользователя
// async (req, res) означает, что мы будем ждать ответа от базы данных
router.post("/register", async (req, res) => {
  // Из запроса (req.body) берём данные, которые отправил пользователь: почту, пароль и роль
  const { email, password, role } = req.body;

  // Шифруем пароль с помощью bcrypt, чтобы не хранить его в открытом виде
  // hash(password, 10) создаёт зашифрованную версию пароля
  const hashedPassword = await bcrypt.hash(password, 10);

  // Пробуем создать нового пользователя в базе данных
  try {
    const user = await User.create({
      email,
      password: hashedPassword,
      role: role || "User",
    });

    // Если всё прошло успешно, отправляем ответ с кодом 201 (создано)
    res.status(201).json({ message: "Пользователь создан", userId: user.id });
  } catch (error) {
    // Если произошла ошибка (например, имя пользователя уже занято), отправляем ошибку с кодом 400
    res.status(400).json({ message: "Ошибка регистрации", error: error.message });
  }
});

// Создаём маршрут POST /login — он нужен для входа пользователя в систему
router.post("/login", async (req, res) => {
  // Из запроса (req.body) берём данные, которые отправил пользователь: имя и пароль
  const { email, password } = req.body;

  // Ищем пользователя в базе данных по имени (username)
  // findOne ищет первую запись, где username совпадает
  const user = await User.findOne({ where: { email } });

  // Проверяем, найден ли пользователь и совпадает ли пароль
  // !user — если пользователь не найден
  // !await bcrypt.compare(password, user.password) — если пароль не совпадает
  // bcrypt.compare сравнивает введённый пароль с зашифрованным паролем в базе
  if (!user || !(await bcrypt.compare(password, user.password))) {
    // Если пользователь не найден или пароль неверный, отправляем ошибку с кодом 401 (нет доступа)
    return res.status(401).json({ message: "Неверные данные" });
  }

  // Если всё правильно, создаём токен для пользователя
  // jwt.sign создаёт токен, который подтверждает, что пользователь вошёл в систему
  // { id: user.id, role: user.role } — данные, которые мы "кладём" в токен (ID и роль пользователя)
  // process.env.JWT_SECRET — секретный ключ из файла .env (нужен для подписи токена)
  // expiresIn: "1h" — токен действует 1 час, потом нужно будет войти заново
  const token = jwt.sign(
    { id: user.id, role: user.role, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  // Отправляем пользователю токен в ответе
  // Пользователь будет использовать этот токен для других запросов 
  res.json({ token });
});

module.exports = router;