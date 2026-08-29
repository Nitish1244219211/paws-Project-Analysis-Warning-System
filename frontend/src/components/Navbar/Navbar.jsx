import { Link, NavLink } from "react-router-dom";
import "../../styles/navbar.css";


export default function Navbar() {
  const navClass = ({ isActive }) => `nav-link ${isActive ? "active" : ""}`;

  return (
    <header className="paws-navbar">
      <div className="paws-government-strip">
        <div className="container">
          Government of India · Public Infrastructure Project Analytics
        </div>
      </div>
      <nav className="navbar sticky-top bg-body-tertiary navbar-expand-lg bg-white">
        <div className="container paws-navbar-inner">
          <Link to="/" className="navbar-brand paws-brand">
            <span className="paws-brand-text">
              <span className="paws-brand-name">PAWS</span>
              <span className="paws-brand-sub">
                Project Analytics &amp; Warning System
              </span>
            </span>
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#pawsNavbar"
            aria-controls="pawsNavbar"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div id="pawsNavbar" className="collapse navbar-collapse">
            <div className="navbar-nav ms-auto align-items-lg-center gap-lg-3">
              <NavLink to="/analyze" className={navClass}>
                Analyze Projects
              </NavLink>
              <a href="/#project-data" className="nav-link">
                Project Data
              </a>
              <a href="/#about-paws" className="nav-link">
                About PAWS
              </a>
              <Link
                to="/analyze"
                className="btn paws-btn-primary paws-nav-cta ms-lg-2"
              >
                Start Analyzing Projects
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <div className="paws-tricolour-rule" />
    </header>
  );
}
