import React, { useContext, useState, Fragment, useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { getDatabase, ref, set, onValue, child, get } from "firebase/database";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, logInWithEmailAndPassword } from "../../firebase";
import { toast } from "react-toastify";
import modeContext from "../../modeContext";

function useQuery() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}

const Achat = (props) => {
  const { mode, setMode } = useContext(modeContext);
  const [user, loading, error] = useAuthState(auth);
  const [userLogged, setUserLogged] = useState(false);
  const [code, setCode] = useState(false);
  const [pop, setPop] = useState(0);
  const [pro, setPro] = useState(0);
  const [eco, setEco] = useState(0);
  const [promo, setPromo] = useState("");
  const [cadeau, setCadeau] = useState("");
  const [reduction, setReduction] = useState(0);
  const [proposition, setProposition] = useState(true);
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
      }
    });
  }, []);
  const payer = () => {
    get(child(dbRef, `users/${userLogged.uid}`)).then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const items = data.items ? { ...data.items } : {};
        items.pro =
          data.items && data.items.pro ? data.items.pro + pro * 1 : pro * 1;
        items.pop =
          data.items && data.items.pop ? data.items.pop + pop * 1 : pop * 1;
        items.eco =
          data.items && data.items.eco ? data.items.eco + eco * 1 : eco * 1;
        const prixTotal =
          Math.round(
            (pop * 11.99 + eco * 59.99 + pro * 95.99) * (1 - reduction) * 100
          ) / 100;

        set(ref(db, "users/" + userLogged.uid + "/items"), items);
        if (mode == "partenaire") {
          history.push("/gestion");
          toast.success("Ton achat de " + prixTotal + "€ est confirmé !", {
            position: toast.POSITION.TOP_CENTER,
          });
        } else {
          toast.success(
            "Ton achat de " +
              prixTotal +
              "€ est confirmé et ton compte est validé, rdv sur l'app 😉",
            {
              position: toast.POSITION.TOP_CENTER,
            }
          );
        }
      }
    });
  };
  const checkPromo = () => {
    setCadeau("");
    get(child(dbRef, `pass/${promo}`)).then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const reductionData = data.reduction;
        setReduction(reductionData / 100);
        toast.success(
          "Le code promo de " + reductionData + "% est appliqué !",
          {
            position: toast.POSITION.TOP_CENTER,
          }
        );
      } else {
        toast.error("Ce code promo n'existe pas !", {
          position: toast.POSITION.TOP_CENTER,
        });
      }
    });
  };
  const setProFun = (valeur) => {
    if (mode == "partenaire") {
      setPro(valeur);
    } else {
      setPro(valeur);
      setEco(0);
      setPop(0);
    }
  };
  const setPopFun = (valeur) => {
    if (mode == "partenaire") {
      setPop(valeur);
    } else {
      setPop(valeur);
      setEco(0);
      setPro(0);
    }
  };
  const setEcoFun = (valeur) => {
    if (mode == "partenaire") {
      setEco(valeur);
    } else {
      setEco(valeur);
      setPro(0);
      setPop(0);
    }
  };
  const checkCadeau = () => {
    setPromo("");
    get(child(dbRef, `pass/${cadeau}`)).then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        console.log("kzuj3iq8", data.reduction);
        if (data.reduction) {
          toast.error("Ceci n'est pas un code cadeau mais un code promo !", {
            position: toast.POSITION.TOP_CENTER,
          });
        } else {
          const reductionData = 100;
          setReduction(reductionData / 100);
          toast.success("Le code cadeau est appliqué !", {
            position: toast.POSITION.TOP_CENTER,
          });
        }
      } else {
        toast.error("Ce code promo n'existe pas !", {
          position: toast.POSITION.TOP_CENTER,
        });
      }
    });
  };
  const cancelPromo = () => {
    setPromo("");
    if (reduction == 0) {
      toast.error("Aucun code pris en compte !", {
        position: toast.POSITION.TOP_CENTER,
      });
    } else {
      setReduction(0);
      toast.error("Le code promo est annulé !", {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  };
  const cancelCadeau = () => {
    setCadeau("");
    if (reduction == 0) {
      toast.error("Aucun code pris en compte !", {
        position: toast.POSITION.TOP_CENTER,
      });
    } else {
      setReduction(0);
      toast.error("Le code cadeau est annulé !", {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  };
  if (true) {
    return (
      <Fragment>
        <section className="procedures">
          <div className="container">
            <div className="row">
              <div className="col-lg-8 col-md-10 m-auto">
                <div className="sec-heading">
                  <h3 className="sec-title">Achat de comptes UNEXTRA</h3>
                </div>
              </div>
            </div>
          </div>
        </section>
        <div class="d-flex justify-content-center">
          <div class="p-2">
            <img
              src={require("../../assets/images/pop.png")}
              alt=""
              style={{ width: 400 }}
            />
          </div>
          <div class="p-2 align-self-center">
            <input
              type="number"
              required
              max={mode == "partenaire" ? 1000000 : 1}
              onChange={(e) => setPopFun(e.target.value)}
              value={pop}
              id="name"
              name="name"
              style={{ width: 100 }}
            />
          </div>
        </div>
        <div class="d-flex justify-content-center mt-5">
          <div class="p-2">
            <img
              src={require("../../assets/images/eco.png")}
              alt=""
              style={{ width: 300 }}
            />
          </div>
          <div class="p-2 align-self-center">
            <input
              type="number"
              required
              max={mode == "partenaire" ? 1000000 : 1}
              onChange={(e) => setEcoFun(e.target.value)}
              value={eco}
              id="name"
              name="name"
              style={{ width: 100 }}
            />
          </div>
        </div>
        <div class="d-flex justify-content-center mt-5 mb-5">
          <div class="p-2">
            <img
              src={require("../../assets/images/pro.png")}
              alt=""
              style={{ width: 300 }}
            />
          </div>
          <div class="p-2 align-self-center">
            <input
              type="number"
              required
              max={mode == "partenaire" ? 1000000 : 1}
              onChange={(e) => setProFun(e.target.value)}
              value={pro}
              id="name"
              name="name"
              style={{ width: 100 }}
            />
          </div>
        </div>
        {(eco > 0 || pro > 0 || pop > 0) && (
          <div class="d-flex flex-column align-items-center mt-5">
            <div class="p-2" style={{ fontWeight: "bold" }}>
              Récapitulatif :
            </div>
            {pop > 0 && (
              <div class="p-2">
                {pop} comptes 24h à 11.99€ soit{" "}
                {Math.round(pop * 11.99 * 100) / 100}€
              </div>
            )}
            {eco > 0 && (
              <div class="p-2">
                {eco} comptes éco à 59.99€ soit{" "}
                {Math.round(eco * 59.99 * 100) / 100}€
              </div>
            )}
            {pro > 0 && (
              <div class="p-2">
                {pro} comptes pro à 95.99€ soit{" "}
                {Math.round(pro * 95.99 * 100) / 100}€
              </div>
            )}
            Soit un total de{" "}
            {Math.round(
              (pop * 11.99 + eco * 59.99 + pro * 95.99) * (1 - reduction) * 100
            ) / 100}
            €{" "}
            {reduction != 0 &&
              "grâce à la réduction de " + reduction * 100 + "% appliquée"}
            <div
              style={{
                marginTop: 20,
                fontWeight: "500",
                textAlign: "center",
              }}
            >
              <div>Entrer un code promo</div>
              <input
                type="text"
                onChange={(e) => setPromo(e.target.value)}
                value={promo}
                id="promo"
                name="promo"
                style={{ width: 100 }}
              />
              <button
                style={{
                  color: "white",
                  backgroundColor: "#00B74A",
                  border: "none",
                  paddingRight: 10,
                  paddingLeft: 10,
                  marginLeft: 5,
                }}
                onClick={checkPromo}
              >
                Ok
              </button>
              <button
                style={{
                  color: "white",
                  backgroundColor: "#F93154",
                  border: "none",
                  paddingRight: 10,
                  paddingLeft: 10,
                  marginLeft: 5,
                }}
                onClick={cancelPromo}
              >
                X
              </button>
              {mode != "partenaire" && (
                <React.Fragment>
                  <div class="mt-3">Entrer un code cadeau</div>
                  <input
                    type="text"
                    onChange={(e) => setCadeau(e.target.value)}
                    value={cadeau}
                    id="cadeau"
                    name="cadeau"
                    style={{ width: 100 }}
                  />
                  <button
                    style={{
                      color: "white",
                      backgroundColor: "#00B74A",
                      border: "none",
                      paddingRight: 10,
                      paddingLeft: 10,
                      marginLeft: 5,
                    }}
                    onClick={checkCadeau}
                  >
                    Ok
                  </button>
                  <button
                    style={{
                      color: "white",
                      backgroundColor: "#F93154",
                      border: "none",
                      paddingRight: 10,
                      paddingLeft: 10,
                      marginLeft: 5,
                    }}
                    onClick={cancelCadeau}
                  >
                    X
                  </button>
                </React.Fragment>
              )}
            </div>
            <button
              type="submit"
              className="btn btn-primary mt-3 mb-5"
              onClick={payer}
            >
              Payer
            </button>
          </div>
        )}
      </Fragment>
    );
  }
};

export default Achat;
