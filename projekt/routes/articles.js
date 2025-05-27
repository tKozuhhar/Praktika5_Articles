const express = require("express");
const { Article, User } = require("../models");
// Подключаем функцию authenticateToken из middleware/auth.js
const { authenticateToken } = require("../middleware/auth");
const router = express.Router();

router.post("/", authenticateToken, async (req, res) => {
  try {
    const { title, content } = req.body;

    const article = await Article.create({
      title,
      content,
      userId: req.user.id, // автор статьи — текущий пользователь
    });

    res.status(201).json(article);
  } catch (error) {
    console.error("Ошибка при создании статьи:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

router.get("/", async (req, res) => {
  const articles = await Article.findAll({
    include: [{
      model: User,
      attributes: ['email'] 
    }]
  });

  res.json(articles);
});

router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const { title, content } = req.body;
    const articleId = req.params.id;

    const article = await Article.findByPk(articleId);

    if (!article) {
      return res.status(404).json({ message: "Статья не найдена" });
    }

    // Проверяем, принадлежит ли статья текущему пользователю
    if (article.userId !== req.user.id) {
      return res.status(403).json({ message: "Нет прав на изменение этой статьи" });
    }

    // Обновляем статью
    article.title = title || article.title;
    article.content = content || article.content;
    await article.save();

    res.json({ message: "Статья обновлена", article });
  } catch (error) {
    console.error("Ошибка при обновлении статьи:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const article = await Article.findByPk(req.params.id);

    if (!article) {
      return res.status(404).json({ message: "Статья не найдена" });
    }

    // Проверка, что пользователь владелец статьи или имеет роль "Admin"
    if (article.userId !== req.user.id && req.user.role !== "Admin") {
      return res.status(403).json({ message: "У вас нет прав удалять эту статью" });
    }

    await article.destroy();

    res.json({ message: "Статья успешно удалена" });
  } catch (error) {
    console.error("Ошибка при удалении статьи:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

// Создаём маршрут GET /article/:id для получения информации по статьи по ID
router.get("/:id", async (req, res) => {
  try {
    const articleId = req.params.id;
    const article = await Article.findOne({
      where: { id: articleId },
      include: [{
        model: User,
        attributes: { exclude: ['password'] } // исключаем password
      }],
    });

    if (!article) {
      return res.status(404).json({ message: "Article is not found" });
    }

    res.json(article);
  } catch (error) {
    console.error("Error fetching article:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;