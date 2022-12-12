import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer id="footer">
      <div className="leftFooter">
        <h1>ECOMMERCE</h1>
        <p>High Quality is our first priority</p>

        <p>Copyrights 2021 &copy; Sheikh Abdullah Sharif</p>
      </div>

      <div className="rightFooter">
        <h4>Follow Us</h4>
        <a href="https://instagram.com">Instagram</a>
        <a href="http://facebook.com">Facebook</a>
      </div>
    </footer>
  );
};

export default Footer;
