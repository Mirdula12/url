import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "./Dashboard.css";

function Dashboard() {
  const [originalUrl, setOriginalUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [urls, setUrls] = useState([]);

  const navigate = useNavigate();

  const fetchUrls = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get("/url/myurls", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUrls(res.data.urls);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUrls();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const res = await API.post(
        "/url/shorten",
        { originalUrl },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setShortUrl(res.data.shortUrl);
      setOriginalUrl("");

      fetchUrls();
    } catch (error) {
      alert(error.response?.data?.message || "Error creating URL");
    }
  };

  const handleDelete = async (shortId) => {
    try {
      const token = localStorage.getItem("token");

      await API.delete(`/url/${shortId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("URL Deleted Successfully");
      fetchUrls();
    } catch (error) {
      alert(error.response?.data?.message || "Delete Failed");
    }
  };

  const handleCopy = (shortId) => {
    navigator.clipboard.writeText(
      `http://localhost:5000/${shortId}`
    );

    alert("Short URL Copied!");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="dashboard-container">

      <button
        className="logout-btn"
        onClick={handleLogout}
      >
        Logout
      </button>

      <h1 className="dashboard-title">
        URL Shortener Dashboard
      </h1>

      <form
        className="url-form"
        onSubmit={handleSubmit}
      >
        <input
          className="url-input"
          type="url"
          placeholder="Paste your long URL here..."
          value={originalUrl}
          onChange={(e) =>
            setOriginalUrl(e.target.value)
          }
          required
        />

        <button
          className="shorten-btn"
          type="submit"
        >
          Shorten URL
        </button>
      </form>

      {shortUrl && (
        <div className="short-url-box">
          <h3>Generated Short URL</h3>

          <a
            href={shortUrl}
            target="_blank"
            rel="noreferrer"
          >
            {shortUrl}
          </a>
        </div>
      )}

      <h2 className="myurls-title">
        My URLs
      </h2>

      {urls.length === 0 ? (
        <div className="url-card">
          <p>No URLs Found</p>
        </div>
      ) : (
        urls.map((url) => (
          <div
            className="url-card"
            key={url._id}
          >
            <p>
              <strong>Original URL:</strong>
              <br />
              {url.originalUrl}
            </p>

            <p>
              <strong>Short URL:</strong>
              <br />
              <a
                href={`http://localhost:5000/${url.shortId}`}
                target="_blank"
                rel="noreferrer"
              >
                {url.shortId}
              </a>
            </p>

            <p>
              <strong>Clicks:</strong> {url.clicks}
            </p>

            <div className="btn-group">
              <button
                className="copy-btn"
                onClick={() =>
                  handleCopy(url.shortId)
                }
              >
                Copy
              </button>

              <button
                className="delete-btn"
                onClick={() =>
                  handleDelete(url.shortId)
                }
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Dashboard;