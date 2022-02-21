import React, { useRef, useState, Fragment, useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { getDatabase, ref, set, onValue } from "firebase/database";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, logInWithEmailAndPassword } from "../../firebase";

function useQuery() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}

const Achat = (props) => {
  const [user, loading, error] = useAuthState(auth);
  const [userLogged, setUserLogged] = useState(false);
  const [code, setCode] = useState(false);
  const [proposition, setProposition] = useState(true);
  const [propal, setPropal] = useState({
    accountNumber: null,
    reduction: null,
  });
  let query = useQuery();
  let location = useLocation();
  const db = getDatabase();
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
  if (true) {
    return (
      <Fragment>
        <section className="procedures">
          <div className="container">
            <div className="row">
              <div className="col-lg-8 col-md-10 m-auto">
                <div className="sec-heading">
                  <h3 className="sec-title">Achat de comptes UNEXTRA</h3>
                  <p>
                    Voici votre marketplace pour acheter des comptes unextra (en
                    cours de construction)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
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
