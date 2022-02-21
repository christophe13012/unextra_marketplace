import React, { useState, Fragment, useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";
import {
  getDatabase,
  ref,
  onValue,
  set,
  child,
  get,
  remove,
} from "firebase/database";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase";
import { toast } from "react-toastify";

function useQuery() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}

const Gestion = (props) => {
  const [user, loading, error] = useAuthState(auth);
  const [userLogged, setUserLogged] = useState(false);
  const [liste, setListe] = useState([]);
  const [compte, setCompte] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  let query = useQuery();
  let location = useLocation();
  const db = getDatabase();
  const dbRef = ref(getDatabase());
  const history = useHistory();
  useEffect(() => {
    auth.onAuthStateChanged(function (user) {
      setUserLogged(user);
      if (user) {
        const prospectRef = ref(db, "prospect/" + user.uid);
        onValue(prospectRef, (snapshot) => {
          const data = snapshot.val();
          setCompte(data.restant);
          setListe(data.liste);
        });
      } else {
        history.push("/");
      }
    });
  }, []);
  async function copyTextToClipboard(text) {
    if ("clipboard" in navigator) {
      return await navigator.clipboard.writeText(text);
    } else {
      return document.execCommand("copy", true, text);
    }
  }
  const handleCopyClick = (copyText) => {
    // Asynchronously call copyTextToClipboard
    copyTextToClipboard(copyText)
      .then(() => {
        // If successful, update the isCopied state value
        setIsCopied(true);
        setTimeout(() => {
          setIsCopied(false);
        }, 1500);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const generate = () => {
    if (compte > 0) {
      get(child(dbRef, `prospect/${userLogged.uid}`)).then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const pass = Math.round(Date.now()).toString(36);
          const liste = data.liste ? [...data.liste] : [];
          const newCompte = {
            createdAt: Date.now(),
            pass,
          };
          liste.push(newCompte);
          data.liste = liste;
          data.restant = data.restant - 1;
          set(ref(db, "prospect/" + userLogged.uid), data);
          set(ref(db, "pass/" + pass), {
            ...newCompte,
            prospect: userLogged.uid,
          });
          toast.success("Le code a bien été généré !", {
            position: toast.POSITION.TOP_CENTER,
          });
        } else {
          console.log("No data available");
        }
      });
    } else {
      // toast vous n'avez plus de comptes disponibles
    }
  };
  const deletePass = (pass) => {
    get(child(dbRef, `prospect/${userLogged.uid}`)).then((snapshot) => {
      if (snapshot.exists()) {
        console.log("pass", pass);
        const data = snapshot.val();
        data.liste = data.liste.filter((x) => x.pass != pass);
        data.restant = data.restant + 1;
        set(ref(db, "prospect/" + userLogged.uid), data);
        remove(ref(db, "pass/" + pass));
        toast.error("Le code a bien été supprimé !", {
          position: toast.POSITION.TOP_CENTER,
        });
      } else {
        console.log("No data available");
      }
    });
  };
  return (
    <Fragment>
      <section className="contact">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 col-md-10 m-auto">
              <div className="sec-heading">
                <h3 className="sec-title">Gestion de mes comptes UNEXTRA</h3>
                <p>Suivez l'évolution de vos comptes.</p>{" "}
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-10 col-md-12 m-auto">
              <div className="mb-5">
                NOMBRE DE COMPTES RESTANTS : {compte ? compte : 0}{" "}
                {compte > 0 && (
                  <button
                    onClick={generate}
                    type="button"
                    style={{
                      marginLeft: 50,
                      backgroundColor: "#4CAF50",
                      border: "none",
                      color: "white",
                      textAlign: "center",
                      textDecoration: "none",
                      display: "inline-block",
                      fontSize: 16,
                      paddingRight: 10,
                      paddingLeft: 10,
                    }}
                  >
                    Génerer un code
                  </button>
                )}
              </div>
              <ul class="list-group">
                {liste &&
                  liste.map((el, id) => {
                    const createdAt = new Date(el.createdAt).toLocaleDateString(
                      "fr-FR"
                    );
                    const validatedAt = el.validatedAt
                      ? new Date(el.validatedAt).toLocaleDateString("fr-FR")
                      : null;
                    return (
                      <li
                        key={id}
                        class="list-group-item d-flex justify-content-between align-items-center"
                      >
                        <div>
                          <div>
                            Code à partager : {el.pass}{" "}
                            {!validatedAt && (
                              <button
                                style={{
                                  marginLeft: 10,
                                  backgroundColor: "#4CAF50",
                                  border: "none",
                                  color: "white",
                                  textAlign: "center",
                                  textDecoration: "none",
                                  display: "inline-block",
                                  fontSize: 14,
                                  paddingRight: 10,
                                  paddingLeft: 10,
                                }}
                                onClick={() => handleCopyClick(el.pass)}
                              >
                                <span>{isCopied ? "Copié !" : "Copier"}</span>
                              </button>
                            )}
                          </div>
                          <div className="d-flex justify-content-between">
                            <div class="font-italic" style={{ fontSize: 13 }}>
                              Créé le {createdAt}
                            </div>
                            <div
                              class="font-italic"
                              style={{ fontSize: 13, marginLeft: 100 }}
                            >
                              {validatedAt
                                ? "Validé le " + validatedAt
                                : "Non utilisé"}
                            </div>
                          </div>
                        </div>
                        {!validatedAt && (
                          <button
                            onClick={() => deletePass(el.pass)}
                            type="button"
                            style={{
                              backgroundColor: "#f44336",
                              border: "none",
                              color: "white",
                              textAlign: "center",
                              textDecoration: "none",
                              display: "inline-block",
                              fontSize: 16,
                              paddingRight: 10,
                              paddingLeft: 10,
                            }}
                          >
                            Supprimer
                          </button>
                        )}
                      </li>
                    );
                  })}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  );
};

export default Gestion;
