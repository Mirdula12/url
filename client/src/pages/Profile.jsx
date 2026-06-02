import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "./Profile.css";


export default function Profile() {
  const [user, setUser] = useState(null);
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("user"));
    setUser(data); // ✅ FIXED (missing line corrected)

    fetchUrls();
  }, []);

  const fetchUrls = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get("/url/myurls", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUrls(res.data.urls || []);
    } catch (err) {
      console.log("Error fetching URLs:", err);
      setUrls([]);
    } finally {
      setLoading(false);
    }
  };

  const firstLetter = user?.name?.charAt(0).toUpperCase();

  return (
    <div className="profile-container">

      <div className="profile-card">

        {/* 🔙 BACK BUTTON */}
        <button
          className="back-btn"
          onClick={() => navigate("/dashboard")}
        >
          ⬅ Back
        </button>

        {/* 👤 AVATAR */}
        <div className="big-circle">
          {firstLetter || "?"}
        </div>

        {/* USER INFO */}
        <h2>{user?.name || "User"}</h2>
        <p>{user?.email || "No email found"}</p>

        {/* 📊 DYNAMIC INFO */}
        <div className="info-box">

          {loading ? (
            <p>Loading your data...</p>
          ) : (
            <>
              <p>📊 Total URLs Created: {urls.length}</p>
              <p>🔗 Active Links: {urls.length}</p>
              <p>⚡ Account Status: Active</p>
              <p>📅 Member Since: 2026</p>
            </>
          )}

        </div>

      </div>

    </div>
  );
}