import React, { useState, Fragment, useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";
import {
  getDatabase,
  ref,
  set,
  onValue,
  child,
  get,
  remove,
} from "firebase/database";
import { auth } from "../../firebase";
import { toast } from "react-toastify";

function useQuery() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}

const Admin = () => {
  const [userLogged, setUserLogged] = useState(false);
  const [code, setCode] = useState("");
  const [nombre, setNombre] = useState(0);
  const [codeWeb, setCodeWeb] = useState("");
  const [type, setType] = useState("0");
  const [reduction, setReduction] = useState(0);
  const [nombreWeb, setNombreWeb] = useState(0);
  const [liste, setListe] = useState([]);
  let query = useQuery();
  let location = useLocation();
  const db = getDatabase();
  const dbRef = ref(getDatabase());
  const history = useHistory();
  useEffect(() => {
    auth.onAuthStateChanged(function (user) {
      setUserLogged(user);
      if (!user) {
        history.push("/");
      } else {
        const uid = user.uid;
        const db = getDatabase();
        const dbRef = ref(getDatabase());
        get(child(dbRef, `users/${uid}`)).then((snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            if (!data.admin) {
              history.push("/");
            }
          }
        });
        const passRef = ref(db, "pass/");
        onValue(passRef, (snapshot) => {
          const data = snapshot.val();
          const arr = [];
          for (const [key, value] of Object.entries(data)) {
            arr.push(value);
          }
          const listeArr = arr.filter((x) => x.type == "admin");
          setListe(listeArr);
        });
      }
    });
  }, []);
  const generateCode = () => {
    if (nombre == 0) {
      toast.warn("La quantité doit être supérieure à 0 !", {
        position: toast.POSITION.TOP_CENTER,
      });
    } else if (code == "") {
      toast.warn("Le code est vide !", {
        position: toast.POSITION.TOP_CENTER,
      });
    } else {
      const codeObj = {
        app: true,
        restant: nombre * 1,
        type: "admin",
        pass: code,
        createdAt: Date.now(),
        typeCompte: type,
        mails: [],
      };
      set(ref(db, "pass/" + code), codeObj);
      toast.success("Le code est actif !", {
        position: toast.POSITION.TOP_CENTER,
      });
      setCode("");
      setNombre(0);
      setCodeWeb("");
      setReduction(0);
      setNombreWeb(0);
      setType("0");
    }
  };
  const generateCodeWeb = () => {
    if (nombreWeb == 0) {
      toast.warn("La quantité doit être supérieure à 0 !", {
        position: toast.POSITION.TOP_CENTER,
      });
    } else if (codeWeb == "") {
      toast.warn("Le code est vide !", {
        position: toast.POSITION.TOP_CENTER,
      });
    } else {
      const codeObj = {
        web: true,
        restant: nombreWeb * 1,
        reduction: reduction,
        type: "admin",
        pass: codeWeb,
        createdAt: Date.now(),
      };
      set(ref(db, "pass/" + codeWeb), codeObj);
      toast.success("Le code est actif !", {
        position: toast.POSITION.TOP_CENTER,
      });
      setCode("");
      setNombre(0);
      setCodeWeb("");
      setReduction(0);
      setNombreWeb(0);
      setType("0");
    }
  };
  const deletePass = (pass) => {
    console.log("pass", pass);
    remove(ref(db, "pass/" + pass));
    toast.error("Le code a bien été supprimé !", {
      position: toast.POSITION.TOP_CENTER,
    });
  };
  return (
    <Fragment>
      <section className="procedures">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 col-md-10 m-auto">
              <div className="sec-heading">
                <h3 className="sec-title">Générer des codes</h3>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="row">
        <div className="col-lg-10 col-md-12 m-auto">
          <div className="row mb-5">
            <div className="col-md-6" style={{ textAlign: "center" }}>
              <div style={{ fontWeight: "bold" }}>Code pour l'application</div>
              <div class="p-2 align-self-center mt-2">
                <div class="form-group">
                  <input
                    class="form-control"
                    placeholder=" Entrer un code"
                    onChange={(e) => setCode(e.target.value)}
                    value={code}
                    id="name"
                    name="name"
                  />
                </div>
                <div class="form-group">
                  <label for="exampleFormControlSelect1">
                    Choisir le type de compte
                  </label>
                  <select
                    class="form-control"
                    id="type"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                  >
                    <option value={0}>Compte 24h</option>
                    <option value={1}>Compte classique</option>
                    <option value={2}>Compte pro</option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="exampleInputPassword1">
                    Choisir le nombre d'utilisation max
                  </label>
                  <input
                    type="number"
                    class="form-control"
                    onChange={(e) => setNombre(e.target.value)}
                    value={nombre}
                    placeholder=" Max"
                  />
                </div>
                <button
                  onClick={generateCode}
                  type="button"
                  style={{
                    backgroundColor: "#23eb11",
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
                  Générer
                </button>
              </div>
            </div>
            <div className="col-md-6" style={{ textAlign: "center" }}>
              <div style={{ fontWeight: "bold" }}>Code pour le site web</div>
              <div class="p-2 align-self-center mt-2">
                <div class="form-group">
                  <input
                    class="form-control"
                    placeholder=" Entrer un code"
                    onChange={(e) => setCodeWeb(e.target.value)}
                    value={codeWeb}
                    id="name"
                    name="name"
                  />
                </div>
                <div class="form-group">
                  <label for="exampleInputPassword1">
                    Choisir la réduction en %
                  </label>
                  <input
                    type="number"
                    class="form-control"
                    onChange={(e) => setReduction(e.target.value)}
                    value={reduction}
                    placeholder=" Max"
                    max={100}
                    min={0}
                  />
                </div>
                <div class="form-group">
                  <label for="exampleInputPassword1">
                    Choisir le nombre d'utilisation max
                  </label>
                  <input
                    type="number"
                    class="form-control"
                    onChange={(e) => setNombreWeb(e.target.value)}
                    value={nombreWeb}
                    placeholder=" Max"
                  />
                </div>
                <button
                  onClick={generateCodeWeb}
                  type="button"
                  style={{
                    backgroundColor: "#23eb11",
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
                  Générer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-10 col-md-12 m-auto">
          <ul class="list-group mb-4">
            {liste.length > 0
              ? liste.map((el, id) => {
                  const createdAt = new Date(el.createdAt).toLocaleDateString(
                    "fr-FR"
                  );
                  const used = el.mails ? el.mails.length : 0;
                  return (
                    <li
                      key={id}
                      class="list-group-item d-flex justify-content-between align-items-center"
                    >
                      <div>
                        <div>Code: {el.pass}</div>
                        <div className="d-flex justify-content-between">
                          <div class="font-italic" style={{ fontSize: 13 }}>
                            Créé le {createdAt}
                          </div>
                          <div
                            class="font-italic"
                            style={{ fontSize: 13, marginLeft: 100 }}
                          >
                            Restant: {el.restant}/{el.restant + used}
                          </div>
                          <div
                            class="font-italic"
                            style={{ fontSize: 13, marginLeft: 100 }}
                          >
                            Type: {el.web ? "Web" : "App"}
                          </div>
                          {el.web ? (
                            <div
                              class="font-italic"
                              style={{ fontSize: 13, marginLeft: 100 }}
                            >
                              Réduction: {el.reduction}%
                            </div>
                          ) : (
                            <div
                              class="font-italic"
                              style={{ fontSize: 13, marginLeft: 100 }}
                            >
                              Compte:{" "}
                              {el.typeCompte == 0
                                ? "24h"
                                : el.typeCompte == 1
                                ? "Classique"
                                : "Pro"}
                            </div>
                          )}
                        </div>
                        <div>
                          Utilisateurs du code :{" "}
                          {el.mails
                            ? el.mails.map((x) => <span>{x}; </span>)
                            : "Aucun"}
                        </div>
                      </div>
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
                    </li>
                  );
                })
              : "Aucun code généré"}
          </ul>
        </div>
      </div>
    </Fragment>
  );
};

export default Admin;
