import { useNavigate } from "react-router-dom";
import "./Home.css";


export default function Home() {
  const navigate = useNavigate();

  return (
   
    <div className="home-container">

      {/* TOP BAR */}
      <div className="top-bar">

  <button
    className="btn login"
    onClick={() => navigate("/login")}
  >
    Login
  </button>

  <button
    className="btn register"
    onClick={() => navigate("/register")}
  >
    Register
  </button>

</div>

      {/* CENTER CONTENT */}
      <div className="center-content">

        <h1>Welcome to URL Shortener App</h1><br></br>

        {/* DESCRIPTION BOX */}
        <div className="desc-box">
          <p>
            Easily shorten your long URLs into simple, shareable links.
            Track clicks, manage your links and improve productivity.
          </p>
          <p>
            Fast, secure and user-friendly URL management platform designed
            for everyone.
          </p>
        </div>

        {/* GET STARTED */}
        <button
          className="get-started"
          onClick={() => navigate("/register")}
        >
          Get Started
        </button>

      </div>

    </div>
   
  );
}