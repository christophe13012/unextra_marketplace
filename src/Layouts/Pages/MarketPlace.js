import React, { Fragment, useEffect, useState } from "react";
import Procedure from "../../Sections/Procedure";
import Appointment from "../../Sections/Appointment";
import { getDatabase, ref, onValue } from "firebase/database";
import { useHistory } from "react-router-dom";
import { auth } from "../../firebase";

const MarketPlace = (props) => {
  const [user, setUser] = useState(null);
  const history = useHistory();

  useEffect(() => {
    auth.onAuthStateChanged(function (user) {
      if (user) {
        // User is signed in.
        setUser(user);
        const uid = user.uid;
        const db = getDatabase();
        const usersRef = ref(db, "users/" + uid);
        onValue(usersRef, (snapshot) => {
          const data = snapshot.val();
          console.log("data", data);
          if (
            data &&
            data.type &&
            (data.type == "admin" || data.type == "commercial")
          ) {
            console.log("admin");
          } else {
            history.push("/gestion");
          }
        });
      } else {
        // No user is signed in.
        setUser(null);
        history.push("/");
      }
    });
  }, []);
  return (
    <Fragment>
      <Procedure />
      <Appointment />
    </Fragment>
  );
};

export default MarketPlace;
