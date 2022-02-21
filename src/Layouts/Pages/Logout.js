import React, { Fragment, useEffect } from "react";
import { logout } from "../../firebase";
import { useHistory } from "react-router-dom";

const Logout = (props) => {
  const history = useHistory();

  useEffect(() => {
    logout();
    history.push("/");
  }, []);
  return <Fragment>Logout</Fragment>;
};

export default Logout;
