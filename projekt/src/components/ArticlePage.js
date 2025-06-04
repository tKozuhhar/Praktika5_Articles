import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "./AuthContext";

function ArticlePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn, userId, userRole } = useContext(AuthContext);

  const [article, setArticle] = useState(null);
  const [comments, setComments] = useState([]);
  const [loadingArticle, setLoadingArticle] = useState(true);
  const [loadingComments, setLoadingComments] = useState(true);
  const [error, setError] = useState(null);

  const [isEditing, setIsEditing] = useState(false); // isEditing — показывает, редактируем ли мы статью сейчас
  const [editTitle, setEditTitle] = useState(''); // editTitle — хранит заголовок статьи во время редактирования
  const [editContent, setEditContent] = useState(''); // editContent — хранит текст статьи во время редактирования

  const [newComment, setNewComment] = useState(''); // newComment — текст нового комментария, который пишет пользователь
  const [submittingComment, setSubmittingComment] = useState(false); // submittingComment — показывает, отправляется ли комментарий на сервер

  const [editingCommentId, setEditingCommentId] = useState(null); // ID комментария, который сейчас редактируется
  const [editingCommentContent, setEditingCommentContent] = useState(''); // текст комментария, который редактируется

  useEffect(() => { // useEffect — запускает код, когда компонент загружается или меняется ID статьи
    const token = localStorage.getItem("token"); // берём токен из localStorage (это как "ключ", чтобы сервер знал, что мы авторизованы)

    const fetchArticle = async () => { // функция для загрузки статьи с сервера
      try {
        const res = await axios.get(`http://localhost:3001/articles/${id}`, { // отправляем GET-запрос на сервер, чтобы взять статью по её ID
          headers: token ? { Authorization: `Bearer ${token}` } : {}, // если есть токен, добавляем его в заголовки запроса
        });
        setArticle(res.data); // сохраняем данные статьи в состояние
      } catch (err) {
        console.error("Error fetching article:", err);
        setError("Failed to load article.");
      } finally {
        setLoadingArticle(false); // когда запрос завершён (успешно или с ошибкой), убираем "загрузку"
      }
    };

    const fetchComments = async () => { // функция для загрузки комментариев с сервера
      try {
        const res = await axios.get(`http://localhost:3001/comments/${id}`, { // отправляем GET-запрос для получения комментариев к статье
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        setComments(res.data);
      } catch (err) {
        console.error("Error fetching comments:", err);
        setError("Failed to load comments.");
      } finally {
        setLoadingComments(false);
      }
    };

    fetchArticle(); // запускаем функции
    fetchComments(); 
  }, [id]); // этот код сработает, если изменится ID статьи

  if (loadingArticle) return <div>Loading article...</div>;
  if (error) return <div>{error}</div>; 
  if (!article) return <div>Article not found.</div>; 

  const canEdit = article.userId === userId; // можно редактировать, если это статья пользователя
  const canDelete = article.userId === userId || userRole === "Admin"; // можно удалять, если это статья пользователя или он админ

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this article?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3001/articles/${id}`, { // отправляем DELETE-запрос на сервер, чтобы удалить статью
        headers: { Authorization: `Bearer ${token}` },
      });

      navigate("/articles"); // после удаления перенаправляем на страницу со списком статей
    } catch (err) {
      console.error("Error deleting article:", err);
      alert("Failed to delete the article. You may not have permission.");
    }
  };

  const handleSave = async () => { // функция для сохранения отредактированной статьи
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:3001/articles/${id}`, { // отправляем PUT-запрос (замена данных), чтобы обновить статью на сервере
        title: editTitle,
        content: editContent,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setArticle(prev => ({ // обновляем статью в состоянии, чтобы изменения сразу отобразились
        ...prev,
        title: editTitle,
        content: editContent,
      }));
      setIsEditing(false); // выключаем режим редактирования
    } catch (err) {
      console.error("Error saving article:", err);
      alert("Failed to update the article.");
    }
  };

  const handleAddComment = async () => { // функция для добавления нового комментария
    if (!newComment.trim()) return; // если комментарий пустой, ничего не делаем

    try {
      setSubmittingComment(true);
      const token = localStorage.getItem("token");

      const res = await axios.post(`http://localhost:3001/comments/${id}`, { // отправляем POST-запрос, чтобы добавить комментарий
        content: newComment
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setComments(prev => [...prev, res.data]); // добавляем новый комментарий в список

      setNewComment(''); // очищаем поле для ввода комментария
    } catch (err) {
      console.error("Error adding comment:", err);
      alert("Failed to add comment.");
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId) => { // функция для удаления комментария
    console.log("Deleting comment with id:", commentId);  
    const confirmDelete = window.confirm("Are you sure you want to delete this comment?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3001/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setComments(prev => prev.filter(comment => comment.id !== commentId)); // удаляем комментарий из списка
    } catch (err) {
      console.error("Error deleting comment:", err);
      alert("Failed to delete the comment.");
    }
  };

  const handleUpdateComment = async () => { // функция для обновления комментария
    if (!editingCommentContent.trim()) return;

    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(`http://localhost:3001/comments/${editingCommentId}`, {
        content: editingCommentContent,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setComments(prev =>
        prev.map(c => (c.id === editingCommentId ? res.data.comment : c))
      );

      setEditingCommentId(null);
      setEditingCommentContent('');
    } catch (err) {
      console.error("Error updating comment:", err);
      alert("Failed to update comment.");
    }
  };

  return (
    <div className="container mt-4">
      <button className="btn btn-secondary mb-3" onClick={() => navigate("/articles")}>
        &larr; Back to Articles
      </button>
      {/* Если мы в режиме редактирования статьи */}
      {isEditing ? (
        <div className="mb-4">
          {/* Поле для редактирования заголовка */}
          <input
            type="text"
            className="form-control mb-2"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
          />
          {/* Поле для редактирования текста статьи */}
          <textarea
            className="form-control mb-2"
            rows="6"
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
          />
          {/* Кнопка для сохранения изменений */}
          <button className="btn btn-success me-2" onClick={handleSave}>
            Save
          </button>
          <button className="btn btn-secondary" onClick={() => setIsEditing(false)}>
            Cancel
          </button>
        </div>
      ) : (
        <>
          {/* отображаем заголовок и текст статьи */}
          <h2>{article.title}</h2>
          <p>{article.content}</p>

          {canEdit && ( // если пользователь может редактировать, показываем кнопку "Edit"
            <button
              className="btn btn-warning me-2"
              onClick={() => {
                setEditTitle(article.title);
                setEditContent(article.content);
                setIsEditing(true);
              }}
            >
              Edit
            </button>
          )}

          {canDelete && ( // если пользователь может удалить, показываем кнопку "Delete"
            <button className="btn btn-danger" onClick={handleDelete}>
              Delete
            </button>
          )}
        </>
      )}
      {/* заголовок для секции комментариев */}
      <h4 className="mt-4">Comments</h4>

      {isLoggedIn && ( // если пользователь авторизован, показываем форму для добавления комментария
        <div className="mb-3">
          <textarea
            className="form-control mb-2"
            rows="3"
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button
            className="btn btn-primary"
            onClick={handleAddComment}
            disabled={submittingComment}
          >
            {submittingComment ? 'Posting...' : 'Post Comment'}
          </button>
        </div>
      )}

      {loadingComments ? (
        <p>Loading comments...</p>
      ) : comments.length > 0 ? (
        <ul className="list-group">
          {[...comments].reverse().map((comment) => {
            const canDeleteComment = comment.User?.id === userId || userRole === "Admin";

            return (
              <li key={comment.id} className="list-group-item d-flex justify-content-between align-items-start">
                <div className="flex-grow-1">
                  {editingCommentId === comment.id ? (
                    <>
                      <textarea
                        className="form-control mb-2"
                        value={editingCommentContent}
                        onChange={(e) => setEditingCommentContent(e.target.value)}
                        rows="2"
                      />
                      <button className="btn btn-sm btn-success me-2" onClick={handleUpdateComment}>
                        Save
                      </button>
                      <button className="btn btn-sm btn-secondary" onClick={() => setEditingCommentId(null)}>
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      {/* показываем текст комментария */}
                      <p className="mb-1">{comment.content}</p>
                      {/* показываем автора и дату комментария */}
                      <small className="text-muted">
                        By: {comment.User?.email || "Unknown"} on {new Date(comment.createdAt).toLocaleString()}
                        {comment.updatedAt && comment.updatedAt !== comment.createdAt && ( // если комментарий редактировался, показываем дату редактирования
                          <> (edited {new Date(comment.updatedAt).toLocaleString()})</>
                        )}
                      </small>
                    </>
                  )}
                </div>
                <div className="ms-3 d-flex flex-column justify-content-start">
                  {comment.User?.id === userId && editingCommentId !== comment.id && (
                    <button
                      className="btn btn-sm btn-warning mb-1"
                      onClick={() => {
                        setEditingCommentId(comment.id);
                        setEditingCommentContent(comment.content);
                      }}
                    >
                      Edit
                    </button>
                  )}
                  {canDeleteComment && (
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDeleteComment(comment.id)}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p>No comments yet.</p>
      )}
    </div>
  );
}


export default ArticlePage;
