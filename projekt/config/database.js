// Подключаем библиотеку Sequelize
const Sequelize = require('sequelize');

// Подключаем библиотеку dotenv, чтобы читать настройки из файла .env (там будут логин, пароль и другие данные для базы)
require('dotenv').config();

// Создаём подключение к базе данных с помощью Sequelize
// Мы передаём 4 параметра: имя базы, логин, пароль и настройки
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mssql',
    dialectOptions: {
      options: {
        // Значение берём из .env (DB_ENCRYPT=true или false)
        encrypt: process.env.DB_ENCRYPT === 'true',
        // Значение берём из .env (DB_TRUST_CERT=true или false)
        trustServerCertificate: process.env.DB_TRUST_CERT === 'true',
      }
    },
    pool: {
      // Максимум 10 соединений одновременно (чтобы не перегружать сервер)
      max: 10,
      // Минимум 0 соединений (если никто не работает, база не держит открытых подключений)
      min: 0,
      // 30 секунд — максимальное время, чтобы дождаться свободного соединения (если все заняты)
      acquire: 30000,
      // 10 секунд — сколько соединение может "простаивать" без дела, прежде чем его закроют
      idle: 10000
    },
  }
);

// Проверяем, можем ли мы подключиться к базе данных
sequelize
  .authenticate() // Пробуем подключиться
  .then(() => {
    console.log('Подключение к базе данных успешно установлено.');
  })
  .catch(err => {
    console.error('Не удалось подключиться к базе данных:', err);
  });

// Экспортируем подключение, чтобы его можно было использовать в других файлах (например, в моделях)
module.exports = sequelize;