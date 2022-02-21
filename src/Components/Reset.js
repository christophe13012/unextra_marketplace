import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import { auth, sendPasswordReset } from "../firebase";
import "../Reset.css";

function Reset() {
  const [email, setEmail] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const history = useHistory();

  useEffect(() => {
    if (loading) return;
    if (user) history.push("/dashboard");
  }, [user, loading]);

  return (
    <div className="reset">
      <div className="reset__container">
        <input
          type="text"
          className="reset__textBox"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Adresse E-mail"
        />
        <button className="reset__btn" onClick={() => sendPasswordReset(email)}>
          M'envoyer le mail de réinitialisation de mot de passe
        </button>

        <div>
          Vous n'avez pas de compte ? <Link to="/register">S'enregistrer</Link>{" "}
          maintenant.
        </div>
      </div>
    </div>
  );
}

export default Reset;
