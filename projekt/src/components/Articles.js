import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";
import { Link } from "react-router-dom";

function Articles() {
  const [articles, setArticles] = useState([]);
  const { isLoggedIn } = useContext(AuthContext);

  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 4;

  const fetchArticles = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:3001/articles", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setArticles(response.data.sort((a, b) => b.id - a.id));
    } catch (error) {
      console.error("Error fetching articles:", error);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleAddArticle = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:3001/articles",
        {
          title: newTitle,
          content: newContent,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await fetchArticles();
      setNewTitle("");
      setNewContent("");
      setShowForm(false);
    } catch (err) {
      console.error("Error creating article:", err);
    }
  };

  // Пагинация
  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = articles.slice(indexOfFirstArticle, indexOfLastArticle);
  const totalPages = Math.ceil(articles.length / articlesPerPage);

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  return (
    <div className="container mt-4">
      <h2>Articles</h2>

      {isLoggedIn ? (
        <>
          <button
            className="btn btn-success mb-3"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "Cancel" : "Add Article"}
          </button>

          {showForm && (
            <form onSubmit={handleAddArticle} className="mb-4">
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Title"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <textarea
                  className="form-control"
                  placeholder="Content"
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  rows="5"
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Submit Article
              </button>
            </form>
          )}
        </>
      ) : (
        <div className="alert alert-info">
          Please sign in to add your own articles.
        </div>
      )}

      {articles.length === 0 ? (
        <p>No articles available.</p>
      ) : (
        <>
          {currentArticles.map((article) => (
            <div key={article.id} className="card mb-3">
              <div className="card-body">
                <h5 className="card-title">{article.title}</h5>
                <p className="card-text">
                  {article.content.length > 250
                    ? article.content.slice(0, 250) + "..."
                    : article.content}
                </p>
                <p className="card-text">
                  <small className="text-muted">By: {article.User.email}</small>
                </p>
                <Link
                  to={`/articles/${article.id}`}
                  className="btn btn-primary btn-sm"
                >
                  Read more...
                </Link>
              </div>
            </div>
          ))}

          {/* Пагинация */}
          <div className="d-flex justify-content-between">
            <button
              className="btn btn-outline-secondary"
              onClick={goToPrevPage}
              disabled={currentPage === 1}
            >
              &larr; Previous
            </button>
            <span className="align-self-center">Page {currentPage} of {totalPages}</span>
            <button
              className="btn btn-outline-secondary"
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
            >
              Next &rarr;
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Articles;