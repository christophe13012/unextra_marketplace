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

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const [code, setCode] = useState(false);
  const history = useHistory();
  let query = useQuery();

  useEffect(() => {
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
          set(ref(db, "prospect/" + user.uid), data);
          // history.push("/prospect?code=" + code);
          history.push({
            pathname: "/prospect",
            search: "?code=" + code,
            state: { detail: data },
          });
        });
      } else {
        history.push("/marketplace");
      }
    }
  }, [user, loading]);
  return (
    <div className="mt-4">
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
          Se connecter
        </button>
        <div>
          <Link to="/reset">Mot de passe oublié</Link>
        </div>
        <div>
          Vous n'avez pas de compte ?{" "}
          <Link to={"/register?code=" + code}>S'enregistrer</Link> maintenant.
        </div>
      </div>
    </div>
  );
}

export default Login;
