import React from "react";
import "./Footer.css";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="f-wrapper">
      <div className="paddings innerWidth flexCenter f-container">
        {/* left side */}
        <div className="flexColStart f-left">
          <img src="./logo2.png" alt="" width={120} />
          <span className="secondaryText">
            Our vision is to help people <br />
            discover safe and reliable homes..
          </span>
        </div>

        <div className="flexColStart f-right">
          <span className="primaryText">Information</span>
          <span className="secondaryText">Multan , Punjab , Pakistan</span>
          <div className="flexCenter f-menu" role="navigation" aria-label="Footer navigation">
            {/* Use react-router Link so navigation works without page reload */}
            <Link to="/properties" className="footer-link">Property</Link>
            <Link to="/services" className="footer-link">Services</Link>
            <Link to="/contact" className="footer-link">Contact</Link>
            <Link to="/about" className="footer-link">About Us</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
