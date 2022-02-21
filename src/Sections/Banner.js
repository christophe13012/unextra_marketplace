import React from "react";
import { Link } from "react-router-dom";
import Login from "../Components/Login";

const banner = (props) => {
  return (
    // Banner section start
    <section className="banner">
      <div className="spa-img">
        <img src={require("../assets/images/ronde.png")} alt="" />
      </div>
      <div className="container">
        <div className="row">
          <div className="col-lg-6">
            <div className="banner-content">
              <h2>Bienvenue sur unExtra Grands Comptes</h2>
              <a
                className="video-btn"
                data-fancybox
                href="https://www.youtube.com/watch?v=FNFKSycZx8k"
              >
                <i className="ti-control-play"></i>
                Qui sommes nous ?
              </a>
              <Login />
            </div>
          </div>
        </div>
      </div>
    </section>
    // Banner section end
  );
};

export default banner;
