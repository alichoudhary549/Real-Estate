import React, { useState } from "react";
import { HiLocationMarker } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import "./HeroSearchBar.css";

const HeroSearchBar = ({ onSearch }) => {
  const [title, setTitle] = useState("");
  const [city, setCity] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // If onSearch callback is provided, use it
    if (onSearch) {
      onSearch({ title, city });
    } else {
      // Otherwise, navigate to properties page with search params
      const params = new URLSearchParams();
      if (title.trim()) params.append('title', title.trim());
      if (city.trim()) params.append('city', city.trim());
      navigate(`/properties?${params.toString()}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flexCenter hero-search-bar">
      <div className="hero-search-input-group">
        <input
          type="text"
          placeholder="Search by property title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="hero-search-input"
        />
      </div>
      <div className="hero-search-input-group">
        <HiLocationMarker color="var(--blue)" size={25} />
        <input
          type="text"
          placeholder="Search by city..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="hero-search-input"
        />
      </div>
      <button type="submit" className="button hero-search-button">
        Search
      </button>
    </form>
  );
};

export default HeroSearchBar;

