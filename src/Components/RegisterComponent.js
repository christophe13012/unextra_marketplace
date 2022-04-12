import React, { useEffect, useState } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import "../Login.css";
import { getDatabase, ref, set, onValue, get, child } from "firebase/database";
import { toast } from "react-toastify";
import { auth, registerWithEmailAndPassword } from "../firebase";

function useQuery() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}

function RegisterComponent({ changeType }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const history = useHistory();
  const [code, setCode] = useState(false);
  let query = useQuery();
  const dbRef = ref(getDatabase());
  const db = getDatabase();

  const register = async () => {
    const user = await registerWithEmailAndPassword(name, email, password);
    set(ref(db, "users/" + user.uid), { items: { eco: 0, pop: 0, pro: 0 } });
    history.push("/gestion");
  };

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
        get(child(dbRef, `prospectEmail/${code}`)).then((snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            set(ref(db, "prospect/" + user.uid), data);

            toast.success("Votre compte a bien été créé !", {
              position: toast.POSITION.TOP_CENTER,
            });
            history.push({
              pathname: "/prospect",
              search: "?code=" + code,
              state: { detail: data },
            });
          } else {
            console.log("No data available");
          }
        });
      } else {
        //history.push("/marketplace");
      }
    }
  }, [user, loading]);
  return (
    <div className="register__container mt-3">
      <input
        type="text"
        className="register__textBox"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Adresse E-mail"
      />
      <input
        type="password"
        className="register__textBox"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Mot de passe"
      />
      <button className="register__btn" onClick={register}>
        CREER UN COMPTE
      </button>
      <button
        type="button"
        class="btn btn-primary mt-3"
        style={{
          backgroundColor: "#1266F1",
          margin: "0 auto",
          display: "inline-block",
        }}
        onClick={changeType}
      >
        J'AI DEJA UN COMPTE ? JE ME CONNECTE
      </button>
    </div>
  );
}

export default RegisterComponent;
