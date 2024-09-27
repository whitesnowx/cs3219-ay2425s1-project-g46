import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import './NavBar.css';

function NavBar() {
  return (
    <nav id="navBar">
      <div id="navBarLogo">
        <a href="/">PeerPrep</a>
      </div>
      <div id="navBarContent">
        <ul id="navBarLinks">
          {/* links to be modified */}
          <li>
            <a href="/">Home</a>
          </li>
          <li id="signUpBtn">
            <a href="/signup">Sign Up</a>
          </li>
          <li id="loginBtn">
            <a href="/login">Login</a>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default NavBar;