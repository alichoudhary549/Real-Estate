import React from "react";
import "./About.css";
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="about-wrapper">
      <div className="innerWidth paddings about-container">
        <header className="about-header">
          <h1 className="primaryText">About Us</h1>
          <p className="secondaryText subtitle">Committed to helping you find safe, reliable, and beautiful homes.</p>
        </header>

        <section className="about-section">
          <h2 className="primaryText">Who We Are</h2>
          <p className="secondaryText">
            We are a dedicated team of real estate professionals focused on creating
            a transparent and trustworthy booking experience for home buyers,
            sellers, and renters.
          </p>
        </section>

        <section className="about-section">
          <h2 className="primaryText">Our Mission & Vision</h2>
          <p className="secondaryText">
            Our mission is to simplify property discovery and transactions by
            offering reliable listings, professional support, and responsive
            customer service. We envision a market where property decisions are
            backed by trust, data, and excellent service.
          </p>
        </section>

        <section className="about-section">
          <h2 className="primaryText">Why Choose Us</h2>
          <ul className="secondaryText">
            <li>Curated and approved property listings</li>
            <li>Experienced support for buying, selling, and renting</li>
            <li>Transparent pricing and honest guidance</li>
            <li>User-first approach and timely communication</li>
          </ul>
        </section>

        <section className="about-section">
          <h2 className="primaryText">Trust, Transparency & Customer Satisfaction</h2>
          <p className="secondaryText">
            We prioritize customer satisfaction by verifying listings, handling
            documentation, and maintaining high service standards to build long-term
            relationships.
          </p>
        </section>

        <div className="about-cta">
          <p>
            Interested in working with us or have a question? Visit our <Link to="/contact">Contact</Link> page.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
