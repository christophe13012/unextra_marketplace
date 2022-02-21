import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, registerWithEmailAndPassword } from "../../firebase";
import "../../Register.css";
import { getDatabase, ref, set, onValue, get, child } from "firebase/database";
import { Link, useHistory, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import Login from "../../Components/Login";
import RegisterComponent from "../../Components/RegisterComponent";

function useQuery() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const history = useHistory();
  const [code, setCode] = useState(false);
  let query = useQuery();
  const dbRef = ref(getDatabase());
  const db = getDatabase();

  return (
    <React.Fragment>
      <section className="banner">
        <div className="spa-img">
          <img src={require("../../assets/images/ronde.png")} alt="" />
        </div>
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <div className="banner-content">
                <h2>Créé ton compte UNEXTRA</h2>
                <RegisterComponent />
              </div>
            </div>
          </div>
        </div>
      </section>
    </React.Fragment>
  );
}

export default Register;
