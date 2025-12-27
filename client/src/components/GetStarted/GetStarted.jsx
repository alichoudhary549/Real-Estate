import React from "react";
import "./GetStarted.css";
const GetStarted = () => {
  return (
    <div id="get-started" className="g-wrapper">
      <div className="paddings innerWidth g-container">
        <div className="flexColCenter inner-container">
          <span className="primaryText">Get started with PLotZo</span>
          <span className="secondaryText">
            Join PlotZo today and explore verified properties with the best market prices.
Find your perfect home in minutes.
            <br />
            Find your residence soon
          </span>
          <button className="button" href>
            <a href="Properties">Explor Properties</a>
          </button>
        </div>
      </div>
    </div>
  );
};

export default GetStarted;
