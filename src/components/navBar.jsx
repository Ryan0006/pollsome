import React from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "../images/logo.png";

const NavBar = ({ user }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <Link className="navbar-brand" to="/">
        <img src={logo} alt="Logo" />
      </Link>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNavAltMarkup"
        aria-controls="navbarNavAltMarkup"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon" />
      </button>
      <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
        <div className="navbar-nav">
          <NavLink className="nav-item nav-link" to="/polls">
            Home
          </NavLink>
          {user && (
            <NavLink className="nav-item nav-link" to="/mypolls">
              My polls
            </NavLink>
          )}
          {!user && (
            <React.Fragment>
              <NavLink className="nav-item nav-link" to="/login">
                Login
              </NavLink>
              <NavLink className="nav-item nav-link" to="/register">
                Signup
              </NavLink>
            </React.Fragment>
          )}
          {user && (
            <NavLink className="nav-item nav-link" to="/logout">
              Logout
            </NavLink>
          )}
          <NavLink className="nav-item nav-link" to="/contactme">
            Contact me
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
