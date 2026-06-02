import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "./Dashboard.css";
import { toast } from "react-toastify";
import { QRCodeSVG } from "react-qr-code";


function Dashboard() {
  const [originalUrl, setOriginalUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [urls, setUrls] = useState([]);
const [search, setSearch] = useState("");
   const [selectedQR, setSelectedQR] = useState("");
  const navigate = useNavigate();

  // 👤 USER DATA (PROFILE ICON)
  const user = JSON.parse(localStorage.getItem("user"));
  const firstLetter = user?.name?.charAt(0).toUpperCase();

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

      toast.success("URL Deleted Successfully");
      fetchUrls();
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete Failed");
    }
  };
  

        const handleCopy = (shortId) => {
        navigator.clipboard.writeText(
          `http://localhost:5000/${shortId}`
        );

        // temporary success message
        toast.success("Copied to clipboard!");
      };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };
  console.log("QR VALUE:", selectedQR);
  const handleQR = (shortId) => {
  const fullUrl = `http://localhost:5000/${shortId}`;
  setSelectedQR(fullUrl);
};
  return (
    <div className="dashboard-container">

      {/* ================= TOP RIGHT ================= */}
      <div className="top-right">

        {/* 👤 PROFILE CIRCLE ONLY */}
        <div
          className="profile-circle"
          onClick={() => navigate("/profile")}
        >
          {firstLetter}
        </div>

        {/* 🔴 LOGOUT */}
        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          Logout
        </button>

      </div>

      {/* ================= TITLE ================= */}
      <h1 className="dashboard-title">
        URL Shortener Dashboard
      </h1>
       
       <input
  className="search-input"
  type="text"
  placeholder="Search your URLs..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
/>

      {/* ================= FORM ================= */}
      <form className="url-form" onSubmit={handleSubmit}>
        <input
          className="url-input"
          type="url"
          placeholder="Paste your long URL here..."
          value={originalUrl}
          onChange={(e) => setOriginalUrl(e.target.value)}
          required
        />

        <button className="shorten-btn" type="submit">
          Shorten URL
        </button>
      </form>

      {/* ================= SHORT URL ================= */}
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

      {/* ================= URL LIST ================= */}
      <h2 className="myurls-title">My URLs</h2>

      {urls.length === 0 ? (
        <div className="url-card">
          <p>No URLs Found</p>
        </div>
      ) : (
        urls.map((url) => (
          <div className="url-card" key={url._id}>
            <p>
              <strong>Original URL:</strong>
              <br />
              {url.originalUrl}
              <br></br>
            </p>
             <br></br>
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
               <br></br>
            <p>
              <strong>Clicks:</strong> {url.clicks}
            </p>

            <div className="btn-group">

            <button
              className="copy-btn"
              onClick={() => handleCopy(url.shortId)}
            >
              Copy
            </button>

            <button
              className="delete-btn"
              onClick={() => handleDelete(url.shortId)}
            >
              Delete
            </button>
            
          

          </div>
          </div>
        ))
        
      )}
       {/* 👇 QR CODE SECTION HERE */}
    {selectedQR && (
  <div className="qr-box">
    <h3>Scan QR Code</h3>

    <div style={{ background: "white", padding: "15px", display: "inline-block" }}>
      <QRCodeSVG value={selectedQR} size={180} />
    </div>

    <p style={{ color: "#fff" }}>{selectedQR}</p>
  </div>
)}
    </div>
  );
}

export default Dashboard;