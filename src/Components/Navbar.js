import React, { Component } from "react";
import { NavLink, withRouter, Link } from "react-router-dom";
import { auth, logInWithEmailAndPassword } from "../firebase";
import { getDatabase, ref, onValue, child, get } from "firebase/database";
import { useLocation } from "react-router-dom";

class Navbar extends Component {
  state = {
    menuOpen: false,
    admin: false,
    user: "",
    menu: "normal",
  };
  componentDidMount() {
    const { match, location, history } = this.props;
    auth.onAuthStateChanged((user) => {
      if (!user) {
        this.setState({ user: "" });
        return;
      }

      this.setState({ user: user.email });

      const uid = user.uid;
      const db = getDatabase();
      const dbRef = ref(getDatabase());
      get(child(dbRef, `users/${uid}`)).then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          if (data && data.admin) {
            this.setState({ admin: true });
          } else {
            this.setState({ admin: false });
          }
        } else {
          this.setState({ admin: false });
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
  toggleMenu = () => {
    if (this.state.menu == "normal") {
      this.setState({ menu: "close" });
    } else {
      this.setState({ menu: "normal" });
    }
  };

  render() {
    let absHeader = this.props.location.pathname === "/" ? " abs-header" : "";
    let right = this.props.location.pathname === "/" ? "" : " text-right";
    return (
      // Header start
      <header
        className={"header" + absHeader}
        style={{ backgroundColor: "white", paddingTop: 30, paddingBottom: 30 }}
      >
        <div className="container">
          <div
            className="row"
            style={{
              flex: 1,
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <img
              className="imageMenu"
              src={
                this.state.menu == "normal"
                  ? require("../assets/images/menu.png")
                  : require("../assets/images/menuclosed.png")
              }
              alt=""
              onClick={this.toggleMenu}
              style={{ width: 60, cursor: "pointer" }}
            />
            {this.state.menu != "normal" && (
              <div
                style={{
                  backgroundImage:
                    "url(" + "https://zupimages.net/up/22/14/figs.png" + ")",
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                  borderRadius: 5,
                  paddingLeft: 5,
                  paddingRight: 5,
                  fontSize: 12,
                  position: "absolute",
                  top: 100,
                  zIndex: 300,
                  width: 400,
                  height: 200,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexDirection: "column",
                  paddingTop: 10,
                  paddingBottom: 10,
                }}
              >
                <a
                  href="https://unextra.com"
                  style={{
                    fontSize: 16,
                    color: "black",
                    fontWeight: "400",
                    cursor: "pointer",
                  }}
                >
                  Accueil
                </a>
                <a
                  href="https://unextra.com/mon-espace-partenaire-inscription/"
                  style={{
                    fontSize: 16,
                    color: "black",
                    fontWeight: "400",
                    cursor: "pointer",
                  }}
                >
                  Espace partenaire
                </a>
                <a
                  href="https://unextra.com/faq/"
                  style={{
                    fontSize: 16,
                    color: "black",
                    fontWeight: "400",
                    cursor: "pointer",
                  }}
                >
                  FAQ
                </a>
                <a
                  href="https://unextra.com/contact/"
                  style={{
                    fontSize: 16,
                    color: "black",
                    fontWeight: "400",
                    cursor: "pointer",
                  }}
                >
                  Contact
                </a>
              </div>
            )}
            <div
              style={{
                alignItems: "center",
                flex: 1,
                display: "flex",
                justifyContent: "center",
              }}
            >
              <NavLink to={"#"}>
                <img
                  className="imageLogo"
                  src={require("../assets/images/logo.png")}
                  style={{ width: 200 }}
                  alt=""
                />
              </NavLink>
            </div>
            <div
              style={{
                flexDirection: "row",
                display: "flex",
                alignItems: "center",
              }}
            >
              <div className="userMail">{this.state.user}</div>
              <img
                className="avatarImage"
                src={require("../assets/images/Avatar.webp")}
                alt=""
                style={{ width: 60, marginLeft: 10 }}
              />
            </div>
            {/* <div className={"col-md-9" + right}>
              <nav className="primary-menu">
                <button
                  className="mobile-menu"
                  onClick={this.menuToggleHandler}
                >
                  <i className="ti-menu"></i>
                </button>
                {this.props.location.pathname != "/" && (
                  <ul className={this.state.menuOpen ? "active" : ""}>
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
                    {this.state.admin && (
                      <li>
                        <NavLink
                          activeStyle={{ color: "#ff817e" }}
                          to="/admin"
                          onClick={this.clearStateHandler}
                        >
                          ADMIN
                        </NavLink>
                      </li>
                    )}
                  </ul>
                )}
              </nav>
                    </div>*/}
          </div>
        </div>
      </header>
      // Header start
    );
  }
}

export default withRouter(Navbar);
