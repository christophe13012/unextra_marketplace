import React, { useRef, useState, Fragment, useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { getDatabase, ref, set, onValue, child, get } from "firebase/database";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, logInWithEmailAndPassword } from "../../firebase";
import { toast } from "react-toastify";

function useQuery() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}

const Achat = (props) => {
  const [user, loading, error] = useAuthState(auth);
  const [userLogged, setUserLogged] = useState(false);
  const [code, setCode] = useState(false);
  const [pop, setPop] = useState(0);
  const [pro, setPro] = useState(0);
  const [eco, setEco] = useState(0);
  const [proposition, setProposition] = useState(true);
  const [propal, setPropal] = useState({
    accountNumber: null,
    reduction: null,
  });
  let query = useQuery();
  let location = useLocation();
  const db = getDatabase();
  const dbRef = ref(getDatabase());
  const history = useHistory();
  useEffect(() => {
    auth.onAuthStateChanged(function (user) {
      setUserLogged(user);
      const code = query.get("code");
      setCode(code);
      // si code
      if (code) {
        // recuperer detail
        const detail = location.state.detail;
        setPropal(detail);
      }
      // sinon check en bd
      else {
        const prospectRef = ref(db, "prospect/" + user.uid);
        onValue(prospectRef, (snapshot) => {
          const data = snapshot.val();
          if (data && !data.payed) {
            setPropal(data);
          } else {
            // Aucune proposition en cours ou elle est payée
            console.log("aucune offre");
            setProposition(false);
          }
        });
      }
    });
  }, []);
  const accept = (e) => {
    e.preventDefault();
    if (propal.reduction == 100) {
      confirmedPayment();
    } else {
      // Paiement
      console.log("payment");
    }
  };
  const confirmedPayment = () => {
    const propalPayed = { ...propal };
    propalPayed.payed = true;
    propalPayed.restant = propalPayed.accountNumber;
    set(ref(db, "prospect/" + userLogged.uid), propalPayed);
    history.push("/gestion");
  };

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
        set(ref(db, "users/" + userLogged.uid + "/items"), items);
        history.push("/gestion");
        toast.success("Ton achat est confirmé !", {
          position: toast.POSITION.TOP_CENTER,
        });
      }
    });
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
              onChange={(e) => setPop(e.target.value)}
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
              onChange={(e) => setEco(e.target.value)}
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
              onChange={(e) => setPro(e.target.value)}
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
            {Math.round((pop * 11.99 + eco * 59.99 + pro * 95.99) * 100) / 100}€
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
  return (
    <Fragment>
      <section className="procedures">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 col-md-10 m-auto">
              <div className="sec-heading">
                <h3 className="sec-title">Confirmation de votre proposition</h3>
                <p>
                  Suite à votre entretien avec notre chargé de client, vous avez
                  bénéficié de l'offre ci-dessous pour commencer notre
                  partenariat.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="appointment">
        <div className="appointment-wrap">
          <figure>
            <img src={require("../../assets/images/resto.jpg")} alt="" />
          </figure>
          <div className="appointment-form">
            <form onSubmit={accept}>
              <div className="form-field half-width">
                <div className="select-field">
                  <div>NOMBRE DE COMPTES RÉSERVÉS : {propal.accountNumber}</div>
                  <div className="mt-2">
                    VOUS AVEZ BÉNÉFICIÉ D'UNE RÉDUCTION DE {propal.reduction}%
                    SUR LE PRIX PUBLIC
                  </div>
                </div>
              </div>
              <button
                className="btn btn-round"
                type="submit"
                className="btn btn-primary mt-3"
              >
                Accepter la proposition
              </button>
            </form>
          </div>
        </div>
      </section>
    </Fragment>
  );
};

export default Achat;
