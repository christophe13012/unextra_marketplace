import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { auth } from "../firebase";

const Footer = (props) => {
  const [email, setEmail] = useState("");
  useEffect(() => {
    auth.onAuthStateChanged(function (user) {
      if (user) {
        // User is signed in.
        setEmail(user.email);
      } else {
        // No user is signed in.
        setEmail(null);
      }
    });
  }, []);
  return (
    // Footer strat
    <footer className="footer">
      <div className="container">
        <div className="row">
          <div className="col-12 text-center">
            <nav className="foo-nav">
              {email && (
                <div>
                  <Link
                    to="/logout"
                    type="button"
                    class="btn btn-danger btn-sm"
                    style={{
                      paddingTop: 10,
                      paddingBottom: 10,
                      fontSize: 12,
                      marginLeft: 15,
                      borderRadius: 5,
                      borderColor: "#262626",
                    }}
                  >
                    Déconnexion
                  </Link>
                </div>
              )}
            </nav>

            {/*  <nav className="foo-nav">
              <ul>
                <li>
                  <Link to="#">ACCUEIL</Link>
                </li>
                <li><Link to="#">About</Link></li>
                                <li><Link to="#">feature</Link></li>
                                <li><Link to="#">service</Link></li>
    <li><Link to="#">Contact</Link></li>
              </ul>
            </nav>*/}
            <p className="copyright">
              &copy; COPYRIGHT 2022 <a href="#">unExtra</a> ALL RIGHTS RESERVED.
            </p>
          </div>
        </div>
      </div>
    </footer>
    // Footer end
  );
};

export default Footer;
