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
    <section className="banner" style={{ backgroundColor: "#2E2E2E" }}>
      <div className="container">
        <div className="row" style={{ justifyContent: "center" }}>
          <div className="col-lg-6">
            <div className="banner-content" style={{}}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  backgroundColor: "white",
                  padding: 20,
                  borderRadius: 5,
                }}
              >
                <img
                  src={require("../assets/images/blocdesk.png")}
                  alt=""
                  style={{ width: "100%" }}
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
    </section>
    // Banner section end
  );
};

export default Banner;
