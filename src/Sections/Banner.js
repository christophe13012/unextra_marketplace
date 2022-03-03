import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { ModeContext } from "../App";
import Login from "../Components/Login";
import RegisterComponent from "../Components/RegisterComponent";
import modeContext from "../modeContext";

const Banner = (props) => {
  const [login, setLogin] = useState(true);
  const { mode, setMode } = useContext(modeContext);
  const setModeFun = (modeFun) => {
    sessionStorage.setItem("mode", modeFun);
    setMode(modeFun);
  };
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
              <h3>Bienvenue sur unExtra</h3>
              {/*<a
                className="video-btn"
                data-fancybox
                href="https://www.youtube.com/watch?v=FNFKSycZx8k"
              >
                <i className="ti-control-play"></i>
                Qui sommes nous ?
              </a>*/}
              <ul class="nav nav-pills nav-fill mt-4">
                <li
                  class="nav-item"
                  style={{ width: "50%" }}
                  onClick={() => setModeFun("partenaire")}
                >
                  <a
                    class={
                      mode == "partenaire" ? "nav-link active" : "nav-link"
                    }
                    aria-current="page"
                    href="#"
                  >
                    Je suis un partenaire
                  </a>
                </li>
                <li
                  class="nav-item"
                  style={{
                    width: "50%",
                  }}
                  onClick={() => setModeFun("normal")}
                >
                  <a
                    class={
                      mode != "partenaire" ? "nav-link active" : "nav-link"
                    }
                    href="#"
                  >
                    Je suis un employeur
                  </a>
                </li>
              </ul>
              <div
                style={{
                  padding: 10,
                  backgroundColor: "#EEBD5D",
                  marginTop: 50,
                  borderRadius: 5,
                }}
              >
                <div
                  style={{
                    color: "white",
                    fontWeight: "bold",
                    marginTop: 5,
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <div>
                    {mode == "partenaire"
                      ? "Je suis partenaire"
                      : "Je recherche"}
                  </div>
                  <img
                    src={require("../assets/images/logo.png")}
                    alt=""
                    style={{ width: 100, height: "100%", marginLeft: 10 }}
                  />
                </div>
                {login ? (
                  <Login changeType={() => setLogin(false)} mode={mode} />
                ) : (
                  <RegisterComponent
                    changeType={() => setLogin(true)}
                    mode={mode}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    // Banner section end
  );
};

export default Banner;
