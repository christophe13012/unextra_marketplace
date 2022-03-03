import React, { useState, useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { Switch, Route } from "react-router-dom";
import Layout from "./Layouts/Layout";
import Home from "./Layouts/Pages/Home";
import Blog from "./Layouts/Pages/Blog";
import About from "./Layouts/Pages/About";
import Contact from "./Layouts/Pages/Contact";
import SinglePost from "./Sections/SinglePost";
import ErrorPage from "./Components/Error";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// All external css
import "./assets/css/themify-icons.css";
import "./assets/css/bootstrap.min.css";
import "./assets/css/style.css";
import Reset from "./Components/Reset";
import Register from "./Layouts/Pages/Register";
import vente from "./Layouts/Pages/Vente";
import MarketPlace from "./Layouts/Pages/MarketPlace";
import Logout from "./Layouts/Pages/Logout";
import Prospect from "./Layouts/Pages/Prospect";
import Gestion from "./Layouts/Pages/Gestion";
import Achat from "./Layouts/Pages/Achat";
import Forbidden from "./Layouts/Pages/Forbidden";
import modeContext from "./modeContext";

export const ModeContext = React.createContext("partenaire");

const App = () => {
  const [mode, setMode] = useState("partenaire");
  useEffect(() => {
    if (sessionStorage.getItem("mode")) {
      setMode(sessionStorage.getItem("mode"));
    }
  }, []);
  return (
    <BrowserRouter>
      <modeContext.Provider value={{ mode, setMode }}>
        <div className="App">
          <Layout>
            <Switch>
              <Route path="/" component={Home} exact />
              <Route path="/logout" component={Logout} />
              <Route path="/prospect" component={Prospect} />
              <Route path="/gestion" component={Gestion} />
              <Route path="/forbidden" component={Forbidden} />
              <Route path="/achat" component={Achat} />
              <Route path="/marketplace" component={MarketPlace} />
              <Route path="/about" component={About} />
              <Route path="/vente" component={vente} exact />
              <Route path="/blog" exact component={Blog} />
              <Route path="/blog/:id" component={SinglePost} />
              <Route path="/contact" component={Contact} />
              <Route path="/reset" component={Reset} />
              <Route path="/register" component={Register} />
              <Route path="*" component={ErrorPage} />
            </Switch>
          </Layout>
          <ToastContainer />
        </div>
      </modeContext.Provider>
    </BrowserRouter>
  );
};

export default App;
