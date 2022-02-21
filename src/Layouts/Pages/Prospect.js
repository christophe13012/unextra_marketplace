import React, { useRef, useState, Fragment, useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { getDatabase, ref, set, onValue } from "firebase/database";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, logInWithEmailAndPassword } from "../../firebase";
import { toast } from "react-toastify";

function useQuery() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}

const Prospect = (props) => {
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
      toast.warn("Seuls les comptes offerts sont pour l'instant gérés !", {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  };
  const confirmedPayment = () => {
    const propalPayed = { ...propal };
    propalPayed.payed = true;
    const restant = propalPayed.restant ? propalPayed.restant : 0;
    propalPayed.restant = propalPayed.accountNumber * 1 + restant * 1;
    set(ref(db, "prospect/" + userLogged.uid), propalPayed);
    toast.success("Félicitations, vos nouveaux comptes sont crédités !", {
      position: toast.POSITION.TOP_CENTER,
    });
    history.push("/gestion");
  };
  if (!proposition) {
    return (
      <Fragment>
        <section className="procedures">
          <div className="container">
            <div className="row">
              <div className="col-lg-8 col-md-10 m-auto">
                <div className="sec-heading">
                  <h3 className="sec-title">Aucune proposition en cours</h3>
                  <p>
                    Vous n'avez aucune proposition en cours de négociation,
                    merci de contacter nos services au ... pour connaitre le
                    détail de nos offres ou directement sur ce site dans la
                    section ACHAT DE COMPTES
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

export default Prospect;
