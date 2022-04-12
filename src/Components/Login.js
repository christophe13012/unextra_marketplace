import React, { useEffect, useState } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { auth, logInWithEmailAndPassword } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import "../Login.css";
import { getDatabase, ref, set, onValue } from "firebase/database";

function useQuery() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}

function Login({ changeType, mode }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const [code, setCode] = useState(false);
  const history = useHistory();
  let query = useQuery();

  useEffect(() => {
    console.log("USER", user);
    const code = query.get("code");
    setCode(code);
    if (loading) {
      // maybe trigger a loading screen
      return;
    }
    if (user) {
      if (code) {
        // enregistrer uid prospect
        const db = getDatabase();
        const prospectRef = ref(db, "prospectEmail/" + code);
        onValue(prospectRef, (snapshot) => {
          const data = snapshot.val();
          /*
          set(ref(db, "prospect/" + user.uid), data);
          // history.push("/prospect?code=" + code);
          history.push({
            pathname: "/prospect",
            search: "?code=" + code,
            state: { detail: data },
          });
          */
        });
      } else {
        if (mode == "partenaire") {
          history.push("/gestion");
        } else {
          history.push("/achat");
        }
      }
    }
  }, [user, loading]);
  return (
    <div
      className="mt-4"
      style={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <div className="login__container">
        <input
          type="text"
          className="login__textBox"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Adresse E-mail"
        />
        <input
          type="password"
          className="login__textBox"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mot de passe"
        />
        <button
          className="login__btn"
          onClick={() => logInWithEmailAndPassword(email, password, code)}
        >
          ME CONNECTER
        </button>
        <div>
          <Link style={{ color: "white" }} to="/reset">
            MOT DE PASSE OUBLIE ?
          </Link>
        </div>
      </div>
      <button
        type="button"
        class="btn btn-primary mt-3"
        style={{
          backgroundColor: "#AA8034",
          margin: "0 auto",
          display: "inline-block",
        }}
        onClick={changeType}
      >
        PAS ENCORE PARTENAIRE ? M'INSCRIRE
      </button>
    </div>
  );
}

export default Login;
