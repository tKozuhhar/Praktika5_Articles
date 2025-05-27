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

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentContent, setEditingCommentContent] = useState('');

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchArticle = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/articles/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        setArticle(res.data);
      } catch (err) {
        console.error("Error fetching article:", err);
        setError("Failed to load article.");
      } finally {
        setLoadingArticle(false);
      }
    };

    const fetchComments = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/comments/${id}`, {
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

    fetchArticle();
    fetchComments();
  }, [id]);

  if (loadingArticle) return <div>Loading article...</div>;
  if (error) return <div>{error}</div>;
  if (!article) return <div>Article not found.</div>;

  const canEdit = article.userId === userId;
  const canDelete = article.userId === userId || userRole === "Admin";

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this article?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3001/articles/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      navigate("/articles");
    } catch (err) {
      console.error("Error deleting article:", err);
      alert("Failed to delete the article. You may not have permission.");
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:3001/articles/${id}`, {
        title: editTitle,
        content: editContent,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setArticle(prev => ({
        ...prev,
        title: editTitle,
        content: editContent,
      }));
      setIsEditing(false);
    } catch (err) {
      console.error("Error saving article:", err);
      alert("Failed to update the article.");
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      setSubmittingComment(true);
      const token = localStorage.getItem("token");

      const res = await axios.post(`http://localhost:3001/comments/${id}`, {
        content: newComment
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setComments(prev => [...prev, res.data]);

      setNewComment('');
    } catch (err) {
      console.error("Error adding comment:", err);
      alert("Failed to add comment.");
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    console.log("Deleting comment with id:", commentId);  
    const confirmDelete = window.confirm("Are you sure you want to delete this comment?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3001/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setComments(prev => prev.filter(comment => comment.id !== commentId));
    } catch (err) {
      console.error("Error deleting comment:", err);
      alert("Failed to delete the comment.");
    }
  };

  const handleUpdateComment = async () => {
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

      {isEditing ? (
        <div className="mb-4">
          <input
            type="text"
            className="form-control mb-2"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
          />
          <textarea
            className="form-control mb-2"
            rows="6"
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
          />
          <button className="btn btn-success me-2" onClick={handleSave}>
            Save
          </button>
          <button className="btn btn-secondary" onClick={() => setIsEditing(false)}>
            Cancel
          </button>
        </div>
      ) : (
        <>
          <h2>{article.title}</h2>
          <p>{article.content}</p>

          {canEdit && (
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

          {canDelete && (
            <button className="btn btn-danger" onClick={handleDelete}>
              Delete
            </button>
          )}
        </>
      )}

      <h4 className="mt-4">Comments</h4>

      {isLoggedIn && (
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
                      <p className="mb-1">{comment.content}</p>
                      <small className="text-muted">
                        By: {comment.User?.email || "Unknown"} on {new Date(comment.createdAt).toLocaleString()}
                        {comment.updatedAt && comment.updatedAt !== comment.createdAt && (
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