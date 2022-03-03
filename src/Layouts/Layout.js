import React, { useContext } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import modeContext from "../modeContext";

const Layout = (props) => {
  const { mode, setMode } = useContext(modeContext);
  return (
    <React.Fragment>
      <Navbar mode={mode} />
      {props.children}
      <Footer />
    </React.Fragment>
  );
};

export default Layout;
