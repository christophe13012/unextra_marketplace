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
import emailjs from "@emailjs/browser";

function useQuery() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}

const Gestion = (props) => {
  const [user, loading, error] = useAuthState(auth);
  const [userLogged, setUserLogged] = useState(false);
  const [liste, setListe] = useState([]);
  const [listePop, setListePop] = useState([]);
  const [listeEco, setListeEco] = useState([]);
  const [listePro, setListePro] = useState([]);
  const [compte, setCompte] = useState(false);
  const [email, setEmail] = useState("");
  const [choix, setChoix] = useState("pop");
  const [pop, setPop] = useState(0);
  const [pro, setPro] = useState(0);
  const [eco, setEco] = useState(0);
  const [items, setItems] = useState({ eco: 0, pro: 0, pop: 0 });
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
        const prospectRef = ref(db, "users/" + user.uid);
        onValue(prospectRef, (snapshot) => {
          const data = snapshot.val();
          console.log("data", data);
          if (data.items) {
            setItems(data.items);
          }
          if (data.pop) {
            setListePop(data.pop);
          } else {
            setListePop([]);
          }
          if (data.eco) {
            setListeEco(data.eco);
          } else {
            setListeEco([]);
          }
          if (data.pro) {
            setListePro(data.pro);
          } else {
            setListePro([]);
          }
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
  const generatePop = () => {
    get(child(dbRef, `users/${userLogged.uid}`)).then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const pass = Math.round(Date.now()).toString(36);
        const pop = data.pop ? [...data.pop] : [];
        const newCompte = {
          createdAt: Date.now(),
          pass,
        };
        pop.push(newCompte);
        data.pop = pop;
        data.items.pop = data.items.pop - 1;
        console.log("data", data);
        set(ref(db, "users/" + userLogged.uid), data);
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
  };
  const generateEco = () => {
    get(child(dbRef, `users/${userLogged.uid}`)).then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const pass = Math.round(Date.now()).toString(36);
        const eco = data.eco ? [...data.eco] : [];
        const newCompte = {
          createdAt: Date.now(),
          pass,
        };
        eco.push(newCompte);
        data.eco = eco;
        data.items.eco = data.items.eco - 1;
        set(ref(db, "users/" + userLogged.uid), data);
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
  };
  const generatePro = () => {
    get(child(dbRef, `users/${userLogged.uid}`)).then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const pass = Math.round(Date.now()).toString(36);
        const pro = data.pro ? [...data.pro] : [];
        const newCompte = {
          createdAt: Date.now(),
          pass,
        };
        pro.push(newCompte);
        data.pro = pro;
        data.items.pro = data.items.pro - 1;
        set(ref(db, "users/" + userLogged.uid), data);
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
  };
  const deletePop = (pass) => {
    get(child(dbRef, `users/${userLogged.uid}`)).then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        data.pop = data.pop.filter((x) => x.pass != pass);
        data.items.pop = data.items.pop + 1;
        set(ref(db, "users/" + userLogged.uid), data);
        remove(ref(db, "pass/" + pass));
        toast.error("Le code a bien été supprimé !", {
          position: toast.POSITION.TOP_CENTER,
        });
      } else {
        console.log("No data available");
      }
    });
  };
  const deleteEco = (pass) => {
    get(child(dbRef, `users/${userLogged.uid}`)).then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        data.eco = data.eco.filter((x) => x.pass != pass);
        data.items.eco = data.items.eco + 1;
        set(ref(db, "users/" + userLogged.uid), data);
        remove(ref(db, "pass/" + pass));
        toast.error("Le code a bien été supprimé !", {
          position: toast.POSITION.TOP_CENTER,
        });
      } else {
        console.log("No data available");
      }
    });
  };
  const deletePro = (pass) => {
    get(child(dbRef, `users/${userLogged.uid}`)).then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        data.pro = data.pro.filter((x) => x.pass != pass);
        data.items.pro = data.items.pro + 1;
        set(ref(db, "users/" + userLogged.uid), data);
        remove(ref(db, "pass/" + pass));
        toast.error("Le code a bien été supprimé !", {
          position: toast.POSITION.TOP_CENTER,
        });
      } else {
        console.log("No data available");
      }
    });
  };
  const validateEmail = (email) => {
    var re = /^\w+([\.-]?\w+)+@\w+([\.:]?\w+)+(\.[a-zA-Z0-9]{2,3})+$/;
    return re.test(email);
  };
  const sendByMail = (code) => {
    const mailOk = validateEmail(email);
    if (mailOk) {
      const templateParams = {
        code: "rere",
        to: email,
      };

      emailjs
        .send(
          "service_281tpu8",
          "template_b16mktc",
          templateParams,
          "user_cs48fHhUC3ofs28N0k1oK"
        )
        .then(
          function (response) {
            console.log("SUCCESS!", response.status, response.text);
            toast.success("Le code a bien été transmis par email !", {
              position: toast.POSITION.TOP_CENTER,
            });
          },
          function (error) {
            console.log("FAILED...", error);
          }
        );
    } else {
      toast.error("Le mail ne semble pas correct, merci de le vérifier !", {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  };
  return (
    <Fragment>
      <section className="contact">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 col-md-10 m-auto">
              <div className="sec-heading">
                <h3 className="sec-title">Gestion de mes comptes UNEXTRA</h3>
                <p>
                  Suivez l'évolution de vos comptes et offrez des codes à vos
                  contacts
                </p>{" "}
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-10 col-md-12 m-auto">
              <div className="mb-5">
                NOMBRE DE COMPTES RESTANTS : {items.eco + items.pro + items.pop}{" "}
                {false && (
                  <button
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
              <ul class="nav nav-pills">
                <li class="nav-item">
                  <a
                    class={choix == "pop" ? "nav-link active" : "nav-link"}
                    aria-current="page"
                    href="#"
                    onClick={() => setChoix("pop")}
                  >
                    Compte 24h ({items.pop})
                  </a>
                </li>
                <li class="nav-item">
                  <a
                    class={choix == "eco" ? "nav-link active" : "nav-link"}
                    href="#"
                    onClick={() => setChoix("eco")}
                  >
                    Compte Eco ({items.eco})
                  </a>
                </li>
                <li class="nav-item">
                  <a
                    class={choix == "pro" ? "nav-link active" : "nav-link"}
                    href="#"
                    onClick={() => setChoix("pro")}
                  >
                    Compte Pro ({items.pro})
                  </a>
                </li>
              </ul>
              {choix == "pop" && (
                <div
                  style={{
                    backgroundColor: "#FFF8E1",
                    marginTop: 20,
                    padding: 10,
                    borderRadius: 5,
                  }}
                >
                  {items.pop > 0 && (
                    <button
                      onClick={generatePop}
                      type="button"
                      style={{
                        marginLeft: 0,
                        backgroundColor: "#4CAF50",
                        border: "none",
                        color: "white",
                        textAlign: "center",
                        textDecoration: "none",
                        display: "inline-block",
                        fontSize: 16,
                        paddingRight: 10,
                        paddingLeft: 10,
                        marginTop: 20,
                      }}
                    >
                      Génerer un code
                    </button>
                  )}
                  <ul class="list-group mt-4">
                    {listePop.length > 0
                      ? listePop.map((el, id) => {
                          const createdAt = new Date(
                            el.createdAt
                          ).toLocaleDateString("fr-FR");
                          const validatedAt = el.validatedAt
                            ? new Date(el.validatedAt).toLocaleDateString(
                                "fr-FR"
                              )
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
                                      <span>
                                        {isCopied ? "Copié !" : "Copier"}
                                      </span>
                                    </button>
                                  )}
                                  {!validatedAt && (
                                    <React.Fragment>
                                      <input
                                        type="email"
                                        placeholder=" Email"
                                        value={email}
                                        onChange={(e) =>
                                          setEmail(e.target.value)
                                        }
                                        id="email"
                                        name="email"
                                        style={{ marginLeft: 20 }}
                                      />
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
                                        onClick={sendByMail}
                                      >
                                        <span>Envoyer par mail</span>
                                      </button>
                                    </React.Fragment>
                                  )}
                                </div>
                                <div className="d-flex justify-content-between">
                                  <div
                                    class="font-italic"
                                    style={{ fontSize: 13 }}
                                  >
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
                                  onClick={() => deletePop(el.pass)}
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
                        })
                      : "Aucun code de ce type généré"}
                  </ul>
                </div>
              )}
              {choix == "eco" && (
                <div
                  style={{
                    backgroundColor: "#FFF8E1",
                    marginTop: 20,
                    padding: 10,
                    borderRadius: 5,
                  }}
                >
                  {items.eco > 0 && (
                    <button
                      onClick={generateEco}
                      type="button"
                      style={{
                        marginLeft: 0,
                        backgroundColor: "#4CAF50",
                        border: "none",
                        color: "white",
                        textAlign: "center",
                        textDecoration: "none",
                        display: "inline-block",
                        fontSize: 16,
                        paddingRight: 10,
                        paddingLeft: 10,
                        marginTop: 20,
                      }}
                    >
                      Génerer un code
                    </button>
                  )}
                  <ul class="list-group mt-4">
                    {listeEco.length > 0
                      ? listeEco.map((el, id) => {
                          const createdAt = new Date(
                            el.createdAt
                          ).toLocaleDateString("fr-FR");
                          const validatedAt = el.validatedAt
                            ? new Date(el.validatedAt).toLocaleDateString(
                                "fr-FR"
                              )
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
                                      <span>
                                        {isCopied ? "Copié !" : "Copier"}
                                      </span>
                                    </button>
                                  )}
                                </div>
                                <div className="d-flex justify-content-between">
                                  <div
                                    class="font-italic"
                                    style={{ fontSize: 13 }}
                                  >
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
                                  onClick={() => deleteEco(el.pass)}
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
                        })
                      : "Aucun code de ce type généré"}
                  </ul>
                </div>
              )}
              {choix == "pro" && (
                <div
                  style={{
                    backgroundColor: "#FFF8E1",
                    marginTop: 20,
                    padding: 10,
                    borderRadius: 5,
                  }}
                >
                  {items.pro > 0 && (
                    <button
                      onClick={generatePro}
                      type="button"
                      style={{
                        marginLeft: 0,
                        backgroundColor: "#4CAF50",
                        border: "none",
                        color: "white",
                        textAlign: "center",
                        textDecoration: "none",
                        display: "inline-block",
                        fontSize: 16,
                        paddingRight: 10,
                        paddingLeft: 10,
                        marginTop: 20,
                      }}
                    >
                      Génerer un code
                    </button>
                  )}
                  <ul class="list-group mt-4">
                    {listePro.length > 0
                      ? listePro.map((el, id) => {
                          const createdAt = new Date(
                            el.createdAt
                          ).toLocaleDateString("fr-FR");
                          const validatedAt = el.validatedAt
                            ? new Date(el.validatedAt).toLocaleDateString(
                                "fr-FR"
                              )
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
                                      <span>
                                        {isCopied ? "Copié !" : "Copier"}
                                      </span>
                                    </button>
                                  )}
                                </div>
                                <div className="d-flex justify-content-between">
                                  <div
                                    class="font-italic"
                                    style={{ fontSize: 13 }}
                                  >
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
                                  onClick={() => deletePro(el.pass)}
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
                        })
                      : "Aucun code de ce type généré"}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  );
};

export default Gestion;
