import React, { Component } from "react";
import { NavLink, withRouter } from "react-router-dom";
import { auth, logInWithEmailAndPassword } from "../firebase";
import { getDatabase, ref, onValue, child, get } from "firebase/database";
import { useLocation } from "react-router-dom";

class Navbar extends Component {
  state = {
    menuOpen: false,
    admin: true,
  };
  componentDidMount() {
    const { match, location, history } = this.props;
    auth.onAuthStateChanged((user) => {
      if (!user) {
        return;
      }

      const uid = user.uid;
      const db = getDatabase();
      const dbRef = ref(getDatabase());
      get(child(dbRef, `users/${uid}`)).then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          if (data && data.type) {
            this.setState({ type: data.type });
          } else {
            this.setState({ type: false });
          }
        } else {
          this.setState({ type: false });
        }
      });
    });
  }

  getLocation = () => {
    const location = useLocation();
    console.log("{location.pathname}", location.pathname);
  };

  // isHome =
  // absHeader = ( this.props.location.pathname === "/") ? ' abs-header' : '';
  // right = ( this.props.location.pathname === '/') ? '' : ' text-right';

  menuToggleHandler = () => {
    this.setState((prevState) => {
      return { menuOpen: !prevState.menuOpen };
    });
  };

  // componentWillUnmount() {
  //     this.clearStateHandler()
  // }

  clearStateHandler = () => {
    if (this.state.menuOpen) {
      this.setState({
        menuOpen: false,
      });
    }
  };

  render() {
    let absHeader = this.props.location.pathname === "/" ? " abs-header" : "";
    let right = this.props.location.pathname === "/" ? "" : " text-right";
    console.log("mode dans navbar", this.props.mode);
    return (
      // Header start
      <header className={"header" + absHeader}>
        <div className="container">
          <div className="row align-items-end">
            <div className="col-md-3">
              <NavLink to={"#"} className="logo">
                <img src={require("../assets/images/logo.png")} alt="" />
              </NavLink>
              <span>{this.props.mode == "partenaire" && "Partenaire"}</span>
            </div>
            <div className={"col-md-9" + right}>
              <nav className="primary-menu">
                <button
                  className="mobile-menu"
                  onClick={this.menuToggleHandler}
                >
                  <i className="ti-menu"></i>
                </button>
                {this.props.location.pathname != "/" && (
                  <ul className={this.state.menuOpen ? "active" : ""}>
                    {/*<li>
                    <NavLink to="/" onClick={this.clearStateHandler}>
                      ACCUEIL
                    </NavLink>
                 </li>*/}
                    {this.props.mode == "partenaire" && (
                      <li>
                        <NavLink
                          activeStyle={{ color: "#ff817e" }}
                          to="/gestion"
                          onClick={this.clearStateHandler}
                        >
                          MES COMPTES UNEXTRA
                        </NavLink>
                      </li>
                    )}
                    {false && (
                      <li>
                        <NavLink
                          activeStyle={{ color: "#ff817e" }}
                          to="/prospect"
                          onClick={this.clearStateHandler}
                        >
                          proposition en cours
                        </NavLink>
                      </li>
                    )}
                    <li>
                      <NavLink
                        activeStyle={{ color: "#ff817e" }}
                        to="/achat"
                        onClick={this.clearStateHandler}
                      >
                        ACHAT DE COMPTES
                      </NavLink>
                    </li>
                  </ul>
                )}
              </nav>
            </div>
          </div>
        </div>
      </header>
      // Header start
    );
  }
}

export default withRouter(Navbar);
