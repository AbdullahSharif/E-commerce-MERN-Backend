import React from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";
import { FaSearch, FaBars, FaShoppingCart } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { AiOutlineLogin, AiOutlineLogout } from "react-icons/ai";
import { useState, useEffect } from "react";
import logo from "../../../images/logo.jpg";
import WebFont from "webfontloader";

const Navbar = (params) => {
  useEffect(() => {
    WebFont.load({
      google: {
        families: ["Droid Sans", "Chilanka"],
      },
    });
  }, []);
  const [openBars, setOpenBars] = useState(false);

  const handleClick = () => {
    console.log("clicked");
    if (openBars === false) {
      setOpenBars(true);
      return;
    }
    setOpenBars(false);
    return;
  };

  return (
    <>
      <nav>
        <div className="bars" onClick={handleClick}>
          <FaBars className="bars" />
        </div>

        <div className="search">
          <FaSearch />
          <input type="search" placeholder="looking for something ..." />
        </div>

        <div className="logo">
          <img src={logo} alt="Logo" />
        </div>
      </nav>
      <div
        className="menu"
        style={{ display: openBars ? "block" : "none" }}
        onClick={handleClick}
      >
        <div>
          <Link to="/">Home</Link>
          <Link to="/about">About Us</Link>
          <Link to="/contactUs">Contact Us</Link>
          <Link to="/partners">Our Partners</Link>
          <Link to="/help">Help</Link>
          <Link to="/shoppingCart">
            <FaShoppingCart className="shoppingCart" />
          </Link>
          <Link to="/profile">
            <CgProfile className="profile" />
          </Link>
          <Link to="/signUp" className="signUp" style={{ color: "black" }}>
            Sign Up
          </Link>
          <Link to="/login" className="logIn">
            <AiOutlineLogin />
            <p>Log In</p>
          </Link>
          <Link to="/" className="logOut">
            <AiOutlineLogout />
            <p>Log Out</p>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Navbar;
