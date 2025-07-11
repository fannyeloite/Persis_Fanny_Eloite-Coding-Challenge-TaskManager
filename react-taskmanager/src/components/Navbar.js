// src/components/Navbar.js
import React from 'react';
import logo from '../assets/logo.jpg'; // place your logo image in src/assets/
import { Link } from 'react-router-dom';


const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-sm navbar-dark" style={{ backgroundColor: '#2a0c5ab7' }}>
      <div className="container-fluid">
        <Link to="/" className="navbar-brand fw-bold fs-4">
         Task Manager
         </Link>



        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mynavbar">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="mynavbar">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <a className="nav-link" href="/register">Register</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/login">Login</a>
            </li>
            <li className="nav-item">
             <a className="nav-link" href="/login">Logout</a>
      </li>
          </ul>

          <form className="d-flex">
            <input className="form-control me-2" type="text" placeholder="Search Here"
              style={{ backgroundColor: '#32e3f7bc', color: '#000', border: 'none' }} />
            <button className="btn btn-primary" type="button">Search</button>
          </form>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;