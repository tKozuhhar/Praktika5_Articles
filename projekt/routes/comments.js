const express = require("express");
const { Article, Comment, User } = require("../models");
const { authenticateToken } = require("../middleware/auth");
const router = express.Router();

router.post("/:articleId", authenticateToken, async (req, res) => {
  try {
    const { content } = req.body;

    const comment = await Comment.create({
      content,
      userId: req.user.id, 
      articleId: req.params.articleId, 
    });

    const fullComment = await Comment.findOne({
      where: { id: comment.id },
      include: {
        model: User,
        attributes: ["id", "email"] 
      }
    });

    res.status(201).json(fullComment);
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ message: "Error creating comment", error: error.message });
  }
});

// Создаём маршрут GET /comments/:articleId — он нужен, чтобы получить все комментарии к статье с юзером и содержанием 
router.get("/:articleId", async (req, res) => {
  try {
    const article = await Article.findOne({
      where: { id: req.params.articleId },
      attributes: [], 
      include: [
        {
          model: Comment,
          attributes: ["id","content", "createdAt"],
          include: [
            {
              model: User,
              attributes: ["id", "email"]
            }
          ]
        }
      ]
    });

    if (!article) {
      return res.status(404).json({ message: "Статья не найдена" });
    }

    res.json(article.Comments);
  } catch (error) {
    console.error("Ошибка при получении комментариев:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

router.delete("/:commentId", authenticateToken, async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ message: "Комментарий не найден" });
    }

    if (comment.userId !== req.user.id && req.user.role !== "Admin") {
      return res.status(403).json({ message: "У вас нет прав на удаление этого комментария" });
    }

    await comment.destroy();
    res.json({ message: "Комментарий удалён" });
  } catch (error) {
    console.error("Ошибка при удалении комментария:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

router.put("/:commentId", authenticateToken, async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.commentId, {
      include: [{ model: User, attributes: ["id", "email"] }]
    });

    if (!comment) {
      return res.status(404).json({ message: "Комментарий не найден" });
    }

    // Проверяем, что пользователь — автор комментария
    if (comment.userId !== req.user.id) {
      return res.status(403).json({ message: "Доступ запрещён: это не ваш комментарий" });
    }

    // Обновляем текст комментария
    comment.content = req.body.content || comment.content;
    await comment.save();

    res.json({ message: "Комментарий обновлён", comment });
  } catch (error) {
    console.error("Ошибка при обновлении комментария:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

module.exports = router;