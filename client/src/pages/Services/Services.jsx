import React from "react";
import "./Services.css";
import { Link } from 'react-router-dom';

const Services = () => {
  return (
    <div className="services-wrapper">
      <div className="innerWidth paddings services-container">
        <header className="services-header">
          <h1 className="primaryText">Our Services</h1>
          <p className="secondaryText">
            We provide end-to-end real estate services to help you buy, sell, rent,
            and manage properties with confidence.
          </p>
        </header>

        <div className="services-grid">
          <div className="service-card">
            <h3 className="primaryText">Property Buying Assistance</h3>
            <p className="secondaryText">
              Personalized property search, market analysis, negotiation support,
              and guided viewings so you find the right home at the right price.
            </p>
          </div>

          <div className="service-card">
            <h3 className="primaryText">Property Selling Support</h3>
            <p className="secondaryText">
              Professional property valuation, marketing, listing, and sales
              negotiation to help you sell quickly and for the best price.
            </p>
          </div>

          <div className="service-card">
            <h3 className="primaryText">Rental Services</h3>
            <p className="secondaryText">
              Tenant matching, rent market guidance, screening, and lease
              management for hassle-free rentals.
            </p>
          </div>

          <div className="service-card">
            <h3 className="primaryText">Property Management</h3>
            <p className="secondaryText">
              Maintenance coordination, rent collection, and regular reporting to
              protect and grow your investment.
            </p>
          </div>

          <div className="service-card">
            <h3 className="primaryText">Legal & Documentation Support</h3>
            <p className="secondaryText">
              Assistance with contracts, title verification, documentation,
              and coordination with trusted legal partners.
            </p>
          </div>
        </div>

        <div className="services-footer-note">
          <p>
            Ready to get started? Visit our <Link to="/contact">Contact</Link> page or
            browse our <Link to="/properties">available properties</Link> to find
            your next home.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Services;
