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
  const [payMode, setPayMode] = useState(false);
  const [load, setLoad] = useState(true);
  const [liste, setListe] = useState([]);
  const [listePop, setListePop] = useState([]);
  const [listeEco, setListeEco] = useState([]);
  const [listePro, setListePro] = useState([]);
  const [compte, setCompte] = useState(false);
  const [promo, setPromo] = useState("");
  const [cadeau, setCadeau] = useState("");
  const [reduction, setReduction] = useState(0);
  const [email, setEmail] = useState({});
  const [userMail, setUserMail] = useState("");
  const [uid, setUid] = useState("");
  const [code, setCode] = useState("");
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
        setUserMail(user.email);
        setUid(user.uid);
        console.log("user", user);
        const prospectRef = ref(db, "users/" + user.uid);
        onValue(prospectRef, (snapshot) => {
          const data = snapshot.val();
          if (data.items) {
            setItems(data.items);
          }
          if (data.pop) {
            const popArr = [];
            for (const [key, value] of Object.entries(data.pop)) {
              popArr.push(value);
            }
            setListePop(popArr);
          } else {
            setListePop([]);
          }
          if (data.eco) {
            const ecoArr = [];
            for (const [key, value] of Object.entries(data.eco)) {
              ecoArr.push(value);
            }
            setListeEco(ecoArr);
          } else {
            setListeEco([]);
          }
          if (data.pro) {
            const proArr = [];
            for (const [key, value] of Object.entries(data.pro)) {
              proArr.push(value);
            }
            setListePro(proArr);
          } else {
            setListePro([]);
          }
          setLoad(false);
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
        const newCompte = {
          createdAt: Date.now(),
          pass,
          type: "pop",
        };
        data.items.pop = data.items.pop - 1;
        console.log("data", data);
        set(ref(db, "users/" + userLogged.uid), data);
        set(ref(db, "users/" + userLogged.uid + "/pop/" + pass), newCompte);
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
        const newCompte = {
          createdAt: Date.now(),
          pass,
          type: "eco",
        };
        data.items.eco = data.items.eco - 1;
        set(ref(db, "users/" + userLogged.uid), data);
        set(ref(db, "users/" + userLogged.uid + "/eco/" + pass), newCompte);
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
        const newCompte = {
          createdAt: Date.now(),
          pass,
          type: "pro",
        };
        data.items.pro = data.items.pro - 1;
        set(ref(db, "users/" + userLogged.uid), data);
        set(ref(db, "users/" + userLogged.uid + "/pro/" + pass), newCompte);
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
    remove(ref(db, `users/${userLogged.uid}/pop/${pass}`));
    remove(ref(db, "pass/" + pass));
    toast.error("Le code a bien été supprimé !", {
      position: toast.POSITION.TOP_CENTER,
    });
  };
  const deleteEco = (pass) => {
    remove(ref(db, `users/${userLogged.uid}/eco/${pass}`));
    remove(ref(db, "pass/" + pass));
    toast.error("Le code a bien été supprimé !", {
      position: toast.POSITION.TOP_CENTER,
    });
  };
  const deletePro = (pass) => {
    remove(ref(db, `users/${userLogged.uid}/pro/${pass}`));
    remove(ref(db, "pass/" + pass));
    toast.error("Le code a bien été supprimé !", {
      position: toast.POSITION.TOP_CENTER,
    });
  };
  const validateEmail = (email) => {
    var re = /^\w+([\.-]?\w+)+@\w+([\.:]?\w+)+(\.[a-zA-Z0-9]{2,3})+$/;
    return re.test(email);
  };
  const sendByMail = (pass) => {
    const mailOk = validateEmail(email[pass]);
    if (mailOk) {
      const templateParams = {
        code: pass,
        to: email[pass],
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
  const generate = () => {
    if (choix == "pop") {
      if (items.pop > 0) {
        generatePop();
      } else {
        toast.error("Vous n'avez pas assez de stock", {
          position: toast.POSITION.TOP_CENTER,
        });
      }
    }
    if (choix == "eco") {
      if (items.eco > 0) {
        generateEco();
      } else {
        toast.error("Vous n'avez pas assez de stock", {
          position: toast.POSITION.TOP_CENTER,
        });
      }
    }
    if (choix == "pro") {
      if (items.pro > 0) {
        generatePro();
      } else {
        toast.error("Vous n'avez pas assez de stock", {
          position: toast.POSITION.TOP_CENTER,
        });
      }
    }
  };
  const checkPromo = () => {
    setCadeau("");
    get(child(dbRef, `pass/${promo}`)).then((snapshot) => {
      if (snapshot.exists() && promo != "") {
        const data = snapshot.val();
        console.log("data", data);
        const reductionData = data.reduction;
        setReduction(reductionData / 100);
        toast.success(
          "Le code partenaire de " + reductionData + "% est appliqué !",
          {
            position: toast.POSITION.TOP_CENTER,
          }
        );
      } else {
        toast.error("Ce code partenaire n'existe pas !", {
          position: toast.POSITION.TOP_CENTER,
        });
      }
    });
  };
  const payer = () => {
    return;
    if (pop + pro + eco > 0) {
      const templateParams = {
        userMail: userMail,
        uid: uid,
        pro: pro,
        pop: pop,
        eco: eco,
        promo: reduction * 100,
        to: "unextraapp@gmail.com",
      };
      emailjs
        .send(
          "service_281tpu8",
          "template_s7l53t7",
          templateParams,
          "user_cs48fHhUC3ofs28N0k1oK"
        )
        .then(
          function (response) {
            console.log("SUCCESS!", response.status, response.text);
            toast.success(
              "Nos conseillers vont vous contacter rapidement par mail sur votre adresse " +
                userMail +
                " pour conclure votre achat et vous accompagner au mieux dans votre expérience UnExtra",
              {
                position: toast.POSITION.TOP_CENTER,
                autoClose: false,
                style: { width: 500, alignSelf: "center" },
              }
            );
            setPop(0);
            setPop(0);
            setEco(0);
            setPromo("");
            setReduction(0);
          },
          function (error) {
            console.log("FAILED...", error);
            toast.warning(
              "Une erreur a eu lieu lors de l'envoi du mail, merci de rééssayer ou contacter nos équipes : unextraapp@gmail.com",
              {
                position: toast.POSITION.TOP_CENTER,
                autoClose: false,
                style: { width: 500, alignSelf: "center" },
              }
            );
          }
        );
    }
  };

  return (
    <Fragment>
      <div
        className="partenaire"
        style={{
          marginTop: 50,
          marginBottom: 50,
          paddingLeft: 50,
          paddingRight: 50,
          display: "flex",
          flex: 1,
        }}
      >
        <div
          className="partenaireImages"
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
            flexDirection: "column",
          }}
        >
          <img
            src={require("../../assets/images/eco.png")}
            alt=""
            style={{ width: 200, marginBottom: 20 }}
          />
          <img
            src={require("../../assets/images/pro.png")}
            alt=""
            style={{ width: 200, marginBottom: 20 }}
          />
          <img
            src={require("../../assets/images/pop.png")}
            alt=""
            style={{ width: 200 }}
          />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 4,
          }}
        >
          <div
            className="panierContainer"
            style={{
              backgroundColor: "white",
              borderRadius: 5,
              paddingTop: 15,
              paddingBottom: 15,
              marginBottom: 20,
              display: "flex",
              flexDirection: "column",
              alignItems: "space-between",
            }}
          >
            <div
              className="labelsPanier"
              style={{ display: "flex", marginBottom: 20 }}
            >
              <div className="produit" style={{ flex: 2, textAlign: "center" }}>
                Produit
              </div>
              <div style={{ flex: 1, textAlign: "center" }}>Quantité</div>
              <div style={{ flex: 1, textAlign: "center" }}>Prix unité</div>
              <div style={{ flex: 1, textAlign: "center" }}>Sous-total HT</div>
            </div>
            <div style={{ display: "flex", marginBottom: 25 }}>
              <div
                className="produit"
                style={{
                  flex: 2,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <img
                  className="imagePanier"
                  src={require("../../assets/images/+eco.png")}
                  alt=""
                  style={{ width: 200 }}
                />
              </div>
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <input
                  type="number"
                  value={eco}
                  onChange={(e) => setEco(e.target.value)}
                  style={{
                    borderRadius: 5,
                    borderWidth: 1,
                    width: 50,
                    borderColor: "#CEA55D",
                    textAlign: "center",
                  }}
                />
                <div
                  className="plusmoins"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    flexDirection: "column",
                    marginLeft: 5,
                  }}
                >
                  <img
                    src={require("../../assets/images/plus.png")}
                    alt=""
                    style={{ width: 35, cursor: "pointer" }}
                    onClick={() => setEco(eco + 1)}
                  />
                  <img
                    src={require("../../assets/images/moins.png")}
                    alt=""
                    style={{ width: 35, cursor: "pointer", marginTop: 2 }}
                    onClick={() => {
                      if (eco > 0) {
                        setEco(eco - 1);
                      }
                    }}
                  />
                </div>
              </div>
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    borderRadius: 5,
                    backgroundColor: "white",
                    width: 90,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px solid #CEA55D",
                  }}
                >
                  49,99€
                </div>
              </div>
              <div
                className="lastPrice"
                style={{
                  flex: 1,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    borderRadius: 5,
                    backgroundColor: "white",
                    width: 90,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px solid #CEA55D",
                  }}
                >
                  {(49.99 * eco).toFixed(2)}€
                </div>
              </div>
            </div>
            <div style={{ display: "flex", marginBottom: 25 }}>
              <div
                className="produit"
                style={{
                  flex: 2,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <img
                  className="imagePanier"
                  src={require("../../assets/images/+pro.png")}
                  alt=""
                  style={{ width: 200 }}
                />
              </div>
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <input
                  type="number"
                  value={pro}
                  onChange={(e) => setPro(e.target.value)}
                  style={{
                    borderRadius: 5,
                    borderWidth: 1,
                    width: 50,
                    borderColor: "#CEA55D",
                    textAlign: "center",
                  }}
                />
                <div
                  className="plusmoins"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    flexDirection: "column",
                    marginLeft: 5,
                  }}
                >
                  <img
                    src={require("../../assets/images/plus.png")}
                    alt=""
                    style={{ width: 35, cursor: "pointer" }}
                    onClick={() => setPro(pro + 1)}
                  />
                  <img
                    src={require("../../assets/images/moins.png")}
                    alt=""
                    style={{ width: 35, cursor: "pointer", marginTop: 2 }}
                    onClick={() => {
                      if (pro > 0) {
                        setPro(pro - 1);
                      }
                    }}
                  />
                </div>
              </div>
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    borderRadius: 5,
                    backgroundColor: "white",
                    width: 90,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px solid #CEA55D",
                  }}
                >
                  79,99€
                </div>
              </div>
              <div
                className="lastPrice"
                style={{
                  flex: 1,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    borderRadius: 5,
                    backgroundColor: "white",
                    width: 90,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px solid #CEA55D",
                  }}
                >
                  {(79.99 * pro).toFixed(2)}€
                </div>
              </div>
            </div>
            <div style={{ display: "flex", marginBottom: 25 }}>
              <div
                className="produit"
                style={{
                  flex: 2,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <img
                  className="imagePanier"
                  src={require("../../assets/images/+pop.png")}
                  alt=""
                  style={{ width: 200 }}
                />
              </div>
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <input
                  type="number"
                  value={pop}
                  onChange={(e) => setPop(e.target.value)}
                  style={{
                    borderRadius: 5,
                    borderWidth: 1,
                    width: 50,
                    borderColor: "#CEA55D",
                    textAlign: "center",
                  }}
                />
                <div
                  className="plusmoins"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    flexDirection: "column",
                    marginLeft: 5,
                  }}
                >
                  <img
                    src={require("../../assets/images/plus.png")}
                    alt=""
                    style={{ width: 35, cursor: "pointer" }}
                    onClick={() => setPop(pop + 1)}
                  />
                  <img
                    src={require("../../assets/images/moins.png")}
                    alt=""
                    style={{ width: 35, cursor: "pointer", marginTop: 2 }}
                    onClick={() => {
                      if (pop > 0) {
                        setPop(pop - 1);
                      }
                    }}
                  />
                </div>
              </div>
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    borderRadius: 5,
                    backgroundColor: "white",
                    width: 90,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px solid #CEA55D",
                  }}
                >
                  9,99€
                </div>
              </div>
              <div
                className="lastPrice"
                style={{
                  flex: 1,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    borderRadius: 5,
                    backgroundColor: "white",
                    width: 90,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px solid #CEA55D",
                  }}
                >
                  {(9.99 * pop).toFixed(2)}€
                </div>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div
                style={{
                  height: 1,
                  backgroundColor: "grey",
                  width: "90%",
                }}
              ></div>
            </div>
            <div
              style={{
                marginTop: 20,
                display: "flex",
                width: 300,
                alignSelf: "flex-end",
              }}
            >
              <div style={{ width: 110, textAlign: "end" }}>Sous-total HT</div>
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    borderRadius: 5,
                    backgroundColor: "white",
                    width: 110,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px solid #CEA55D",
                  }}
                >
                  {(
                    (eco * 49.99 + pro * 79.99 + pop * 9.99) *
                    (1 - reduction)
                  ).toFixed(2)}
                  €
                </div>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                width: 300,
                alignSelf: "flex-end",
              }}
            >
              <div
                style={{
                  width: 110,
                  textAlign: "end",
                  fontSize: 10,
                }}
              >
                Taux TVA 20%
              </div>
              <div
                style={{
                  flex: 1,
                }}
              ></div>
            </div>
            <div
              style={{
                display: "flex",
                width: 300,
                alignSelf: "flex-end",
              }}
            >
              <div style={{ width: 110, textAlign: "end" }}>Total TTC</div>
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    borderRadius: 5,
                    backgroundColor: "white",
                    width: 110,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px solid #CEA55D",
                  }}
                >
                  {(
                    (eco * 49.99 + pro * 79.99 + pop * 9.99) *
                    1.2 *
                    (1 - reduction)
                  ).toFixed(2)}
                  €
                </div>
              </div>
            </div>
          </div>
          <div
            style={{
              backgroundColor: "white",
              borderRadius: 5,
              display: "flex",
              paddingTop: 15,
              paddingBottom: 15,
              justifyContent: "flex-end",
              paddingRight: 35,
            }}
          >
            <input
              type="text"
              placeholder=" Code partenaire"
              onChange={(e) => setPromo(e.target.value)}
              value={promo}
              id="code"
              name="code"
              style={{
                marginRight: 20,
                borderRadius: 5,
                borderWidth: 1,
                paddingLeft: 5,
              }}
            />
            {reduction != 0 ? (
              <div
                className="textPromo"
                style={{
                  textAlign: "center",
                }}
              >
                Grâce à ce code vous économisez{" "}
                {(
                  eco * 49.99 +
                  pro * 79.99 +
                  pop * 9.99 -
                  (eco * 49.99 + pro * 79.99 + pop * 9.99) *
                    1.2 *
                    (1 - reduction)
                ).toFixed(2)}
                €
              </div>
            ) : (
              <img
                onClick={checkPromo}
                src={require("../../assets/images/valider.png")}
                alt=""
                style={{ width: 125, cursor: "pointer" }}
              />
            )}
          </div>
          <div
            className="generateContainer"
            style={{ display: "flex", marginTop: 20 }}
          >
            <div
              className="generate"
              style={{
                flex: 1,
                padding: 10,
                backgroundColor: "white",
                borderRadius: 5,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  height: 25,
                }}
              >
                <div onClick={generate}>
                  <img
                    src={require("../../assets/images/generer.png")}
                    alt=""
                    style={{ cursor: "pointer", width: 140 }}
                  />
                </div>
                <div className="mb-5" style={{ fontSize: 12 }}>
                  Nombre de comptes restants :{" "}
                  {items.eco + items.pro + items.pop}{" "}
                </div>
                <div
                  onClick={() => setChoix("pop")}
                  style={{
                    backgroundImage:
                      choix == "pop"
                        ? "url(" +
                          "https://zupimages.net/up/22/15/f0wu.png" +
                          ")"
                        : "url(" +
                          "https://zupimages.net/up/22/14/jied.png" +
                          ")",
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    borderRadius: 5,
                    paddingLeft: 5,
                    paddingRight: 5,
                    fontSize: 12,
                    cursor: "pointer",
                  }}
                >
                  Compte pop ({items.pop})
                </div>
                <div
                  onClick={() => setChoix("eco")}
                  style={{
                    backgroundImage:
                      choix == "eco"
                        ? "url(" +
                          "https://zupimages.net/up/22/15/f0wu.png" +
                          ")"
                        : "url(" +
                          "https://zupimages.net/up/22/14/jied.png" +
                          ")",
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    borderRadius: 5,
                    paddingLeft: 5,
                    paddingRight: 5,
                    fontSize: 12,
                    cursor: "pointer",
                  }}
                >
                  Compte Eco ({items.eco})
                </div>
                <div
                  onClick={() => setChoix("pro")}
                  style={{
                    backgroundImage:
                      choix == "pro"
                        ? "url(" +
                          "https://zupimages.net/up/22/15/f0wu.png" +
                          ")"
                        : "url(" +
                          "https://zupimages.net/up/22/14/jied.png" +
                          ")",
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    borderRadius: 5,
                    paddingLeft: 5,
                    paddingRight: 5,
                    fontSize: 12,
                    cursor: "pointer",
                  }}
                >
                  Compte Pro ({items.pro})
                </div>
              </div>
              <div style={{}}>
                {choix == "pop" && (
                  <div>
                    {load ? (
                      <ul
                        class="list-group mt-4"
                        style={{
                          marginLeft: 20,
                          display: "flex",
                          alignItems: "center",
                          paddingBottom: 40,
                        }}
                      >
                        <div
                          class="spinner-border"
                          role="status"
                          style={{ marginLeft: 20 }}
                        >
                          <span class="visually-hidden"></span>
                        </div>
                      </ul>
                    ) : (
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
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "flex-end",
                                      justifyContent: "space-around",
                                      flex: 1,
                                    }}
                                  >
                                    <div>
                                      <div style={{ fontSize: 12 }}>
                                        Code à partager :
                                      </div>
                                      <div
                                        style={{
                                          display: "flex",
                                          justifyContent: "center",
                                          border: "1px solid #CEA55D",
                                          borderRadius: 5,
                                        }}
                                      >
                                        {el.pass}
                                      </div>
                                    </div>
                                    <div
                                      style={{
                                        marginLeft: 10,
                                        backgroundImage:
                                          "url(" +
                                          "https://zupimages.net/up/22/15/f0wu.png" +
                                          ")",
                                        backgroundPosition: "center",
                                        backgroundSize: "cover",
                                        backgroundRepeat: "no-repeat",
                                        borderRadius: 5,
                                        color: "black",
                                        textAlign: "center",
                                        textDecoration: "none",
                                        display: "inline-block",
                                        fontSize: 14,
                                        paddingRight: 10,
                                        paddingLeft: 10,
                                        cursor: "pointer",
                                      }}
                                      onClick={() => handleCopyClick(el.pass)}
                                    >
                                      {isCopied ? "Copié !" : "Copier"}
                                    </div>
                                    <div style={{ marginLeft: 20 }}>
                                      <div style={{ fontSize: 12 }}>
                                        Adresse email :
                                      </div>
                                      <input
                                        type="email"
                                        placeholder=" Email"
                                        value={email[el.pass]}
                                        onChange={(e) =>
                                          setEmail({
                                            ...email,
                                            [el.pass]: e.target.value,
                                          })
                                        }
                                        id="email"
                                        name="email"
                                        style={{
                                          border: "1px solid #CEA55D",
                                          borderRadius: 5,
                                        }}
                                      />
                                    </div>
                                    <img
                                      onClick={() => sendByMail(el.pass)}
                                      src={require("../../assets/images/envoyer.png")}
                                      alt=""
                                      style={{
                                        width: 100,
                                        height: 30,
                                        cursor: "pointer",
                                      }}
                                    />
                                    <img
                                      onClick={() => deletePop(el.pass)}
                                      src={require("../../assets/images/supprimer.png")}
                                      alt=""
                                      style={{
                                        width: 80,
                                        height: 25,
                                        marginBottom: 3,
                                        cursor: "pointer",
                                      }}
                                    />
                                  </div>
                                </li>
                              );
                            })
                          : "Aucun code de ce type généré"}
                      </ul>
                    )}
                  </div>
                )}
                {choix == "eco" && (
                  <div>
                    {load ? (
                      <ul
                        class="list-group mt-4"
                        style={{
                          marginLeft: 20,
                          display: "flex",
                          alignItems: "center",
                          paddingBottom: 40,
                        }}
                      >
                        <div
                          class="spinner-border"
                          role="status"
                          style={{ marginLeft: 20 }}
                        >
                          <span class="visually-hidden"></span>
                        </div>
                      </ul>
                    ) : (
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
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "flex-end",
                                      justifyContent: "space-around",
                                      flex: 1,
                                    }}
                                  >
                                    <div>
                                      <div style={{ fontSize: 12 }}>
                                        Code à partager :
                                      </div>
                                      <div
                                        style={{
                                          display: "flex",
                                          justifyContent: "center",
                                          border: "1px solid #CEA55D",
                                          borderRadius: 5,
                                        }}
                                      >
                                        {el.pass}
                                      </div>
                                    </div>
                                    <div style={{}}>
                                      <button
                                        style={{
                                          marginLeft: 10,
                                          backgroundImage:
                                            "url(" +
                                            "https://zupimages.net/up/22/15/f0wu.png" +
                                            ")",
                                          backgroundPosition: "center",
                                          backgroundSize: "cover",
                                          backgroundRepeat: "no-repeat",
                                          border: "none",
                                          borderRadius: 5,
                                          color: "black",
                                          textAlign: "center",
                                          textDecoration: "none",
                                          display: "inline-block",
                                          fontSize: 14,
                                          paddingRight: 10,
                                          paddingLeft: 10,
                                          cursor: "pointer",
                                        }}
                                        onClick={() => handleCopyClick(el.pass)}
                                      >
                                        <span>
                                          {isCopied ? "Copié !" : "Copier"}
                                        </span>
                                      </button>
                                    </div>
                                    <div style={{ marginLeft: 20 }}>
                                      <div style={{ fontSize: 12 }}>
                                        Adresse email :
                                      </div>
                                      <input
                                        type="email"
                                        placeholder=" Email"
                                        value={email[el.pass]}
                                        onChange={(e) =>
                                          setEmail({
                                            ...email,
                                            [el.pass]: e.target.value,
                                          })
                                        }
                                        id="email"
                                        name="email"
                                        style={{
                                          border: "1px solid #CEA55D",
                                          borderRadius: 5,
                                        }}
                                      />
                                    </div>
                                    <img
                                      onClick={() => sendByMail(el.pass)}
                                      src={require("../../assets/images/envoyer.png")}
                                      alt=""
                                      style={{
                                        width: 100,
                                        height: 30,
                                        cursor: "pointer",
                                      }}
                                    />
                                    <img
                                      onClick={() => deleteEco(el.pass)}
                                      src={require("../../assets/images/supprimer.png")}
                                      alt=""
                                      style={{
                                        width: 80,
                                        height: 25,
                                        marginBottom: 3,
                                        cursor: "pointer",
                                      }}
                                    />
                                  </div>
                                </li>
                              );
                            })
                          : "Aucun code de ce type généré"}
                      </ul>
                    )}
                  </div>
                )}
                {choix == "pro" && (
                  <div>
                    {load ? (
                      <ul
                        class="list-group mt-4"
                        style={{
                          marginLeft: 20,
                          display: "flex",
                          alignItems: "center",
                          paddingBottom: 40,
                        }}
                      >
                        <div
                          class="spinner-border"
                          role="status"
                          style={{ marginLeft: 20 }}
                        >
                          <span class="visually-hidden"></span>
                        </div>
                      </ul>
                    ) : (
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
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "flex-end",
                                      justifyContent: "space-around",
                                      flex: 1,
                                    }}
                                  >
                                    <div>
                                      <div style={{ fontSize: 12 }}>
                                        Code à partager :
                                      </div>
                                      <div
                                        style={{
                                          display: "flex",
                                          justifyContent: "center",
                                          border: "1px solid #CEA55D",
                                          borderRadius: 5,
                                        }}
                                      >
                                        {el.pass}
                                      </div>
                                    </div>
                                    <div style={{}}>
                                      <button
                                        style={{
                                          marginLeft: 10,
                                          backgroundImage:
                                            "url(" +
                                            "https://zupimages.net/up/22/15/f0wu.png" +
                                            ")",
                                          backgroundPosition: "center",
                                          backgroundSize: "cover",
                                          backgroundRepeat: "no-repeat",
                                          border: "none",
                                          borderRadius: 5,
                                          color: "black",
                                          textAlign: "center",
                                          textDecoration: "none",
                                          display: "inline-block",
                                          fontSize: 14,
                                          paddingRight: 10,
                                          paddingLeft: 10,
                                          cursor: "pointer",
                                        }}
                                        onClick={() => handleCopyClick(el.pass)}
                                      >
                                        <span>
                                          {isCopied ? "Copié !" : "Copier"}
                                        </span>
                                      </button>
                                    </div>
                                    <div style={{ marginLeft: 20 }}>
                                      <div style={{ fontSize: 12 }}>
                                        Adresse email :
                                      </div>
                                      <input
                                        type="email"
                                        placeholder=" Email"
                                        value={email[el.pass]}
                                        onChange={(e) =>
                                          setEmail({
                                            ...email,
                                            [el.pass]: e.target.value,
                                          })
                                        }
                                        id="email"
                                        name="email"
                                        style={{
                                          border: "1px solid #CEA55D",
                                          borderRadius: 5,
                                        }}
                                      />
                                    </div>
                                    <img
                                      onClick={() => sendByMail(el.pass)}
                                      src={require("../../assets/images/envoyer.png")}
                                      alt=""
                                      style={{
                                        width: 100,
                                        height: 30,
                                        cursor: "pointer",
                                      }}
                                    />
                                    <img
                                      onClick={() => deletePro(el.pass)}
                                      src={require("../../assets/images/supprimer.png")}
                                      alt=""
                                      style={{
                                        width: 80,
                                        height: 25,
                                        marginBottom: 3,
                                        cursor: "pointer",
                                      }}
                                    />
                                  </div>
                                </li>
                              );
                            })
                          : "Aucun code de ce type généré"}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div
              className="generateMobile"
              style={{
                flex: 1,
                padding: 10,
                backgroundColor: "white",
                borderRadius: 5,
                marginTop: 20,
                display: "none",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    height: 30,
                  }}
                >
                  <div onClick={generate}>
                    <img
                      src={require("../../assets/images/generer.png")}
                      alt=""
                      style={{ cursor: "pointer", width: 100, marginRight: 30 }}
                    />
                  </div>
                  <div className="mb-5" style={{ fontSize: 9 }}>
                    Nombre de comptes restants :{" "}
                    {items.eco + items.pro + items.pop}{" "}
                  </div>
                </div>
                <div
                  onClick={() => setChoix("pop")}
                  style={{
                    backgroundImage:
                      choix == "pop"
                        ? "url(" +
                          "https://zupimages.net/up/22/15/f0wu.png" +
                          ")"
                        : "url(" +
                          "https://zupimages.net/up/22/14/jied.png" +
                          ")",
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    borderRadius: 5,
                    paddingLeft: 5,
                    paddingRight: 5,
                    fontSize: 12,
                    cursor: "pointer",
                    textAlign: "center",
                    width: "50%",
                    alignSelf: "center",
                    marginTop: 10,
                  }}
                >
                  Compte pop ({items.pop})
                </div>
                <div
                  onClick={() => setChoix("eco")}
                  style={{
                    backgroundImage:
                      choix == "eco"
                        ? "url(" +
                          "https://zupimages.net/up/22/15/f0wu.png" +
                          ")"
                        : "url(" +
                          "https://zupimages.net/up/22/14/jied.png" +
                          ")",
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    borderRadius: 5,
                    paddingLeft: 5,
                    paddingRight: 5,
                    fontSize: 12,
                    cursor: "pointer",
                    textAlign: "center",
                    width: "50%",
                    alignSelf: "center",
                    marginTop: 5,
                    marginBottom: 5,
                  }}
                >
                  Compte Eco ({items.eco})
                </div>
                <div
                  onClick={() => setChoix("pro")}
                  style={{
                    backgroundImage:
                      choix == "pro"
                        ? "url(" +
                          "https://zupimages.net/up/22/15/f0wu.png" +
                          ")"
                        : "url(" +
                          "https://zupimages.net/up/22/14/jied.png" +
                          ")",
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    borderRadius: 5,
                    paddingLeft: 5,
                    paddingRight: 5,
                    fontSize: 12,
                    cursor: "pointer",
                    textAlign: "center",
                    width: "50%",
                    alignSelf: "center",
                  }}
                >
                  Compte Pro ({items.pro})
                </div>
              </div>
              <div style={{}}>
                {choix == "pop" && (
                  <div>
                    {load ? (
                      <ul
                        class="list-group mt-4"
                        style={{
                          marginLeft: 20,
                          display: "flex",
                          alignItems: "center",
                          paddingBottom: 40,
                        }}
                      >
                        <div
                          class="spinner-border"
                          role="status"
                          style={{ marginLeft: 20 }}
                        >
                          <span class="visually-hidden"></span>
                        </div>
                      </ul>
                    ) : (
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
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    flex: 1,
                                    borderWidth: 1,
                                    borderColor: "gold",
                                    borderStyle: "solid",
                                    borderRadius: 10,
                                    padding: 10,
                                    marginBottom: 10,
                                  }}
                                >
                                  <div
                                    style={{
                                      flex: 1,
                                      flexDirection: "row",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                    }}
                                  >
                                    <div style={{ fontSize: 12 }}>
                                      Code à partager :
                                    </div>
                                    <div
                                      style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        border: "1px solid #CEA55D",
                                        borderRadius: 5,
                                        width: "40%",
                                        marginLeft: 10,
                                      }}
                                    >
                                      {el.pass}
                                    </div>
                                    <button
                                      style={{
                                        marginLeft: 10,
                                        backgroundImage:
                                          "url(" +
                                          "https://zupimages.net/up/22/15/f0wu.png" +
                                          ")",
                                        backgroundPosition: "center",
                                        backgroundSize: "cover",
                                        backgroundRepeat: "no-repeat",
                                        border: "none",
                                        borderRadius: 5,
                                        color: "black",
                                        textAlign: "center",
                                        textDecoration: "none",
                                        display: "inline-block",
                                        fontSize: 14,
                                        paddingRight: 10,
                                        paddingLeft: 10,
                                        cursor: "pointer",
                                      }}
                                      onClick={() => handleCopyClick(el.pass)}
                                    >
                                      <span>
                                        {isCopied ? "Copié !" : "Copier"}
                                      </span>
                                    </button>
                                  </div>
                                  <div
                                    style={{
                                      display: "flex",
                                      flex: 1,
                                      alignItems: "center",
                                      justifyContent: "center",
                                      marginTop: 10,
                                    }}
                                  >
                                    <input
                                      type="email"
                                      placeholder=" Partager par email"
                                      value={email[el.pass]}
                                      onChange={(e) =>
                                        setEmail({
                                          ...email,
                                          [el.pass]: e.target.value,
                                        })
                                      }
                                      id="email"
                                      name="email"
                                      style={{
                                        border: "1px solid #CEA55D",
                                        borderRadius: 5,
                                      }}
                                    />
                                    <img
                                      onClick={() => sendByMail(el.pass)}
                                      src={require("../../assets/images/envoyer.png")}
                                      alt=""
                                      style={{
                                        width: 80,
                                        height: 25,
                                        cursor: "pointer",
                                        marginLeft: 10,
                                        marginRight: 10,
                                      }}
                                    />
                                    <img
                                      onClick={() => deletePop(el.pass)}
                                      src={require("../../assets/images/supprimer.png")}
                                      alt=""
                                      style={{
                                        width: 70,
                                        height: 20,
                                        cursor: "pointer",
                                      }}
                                    />
                                  </div>
                                </li>
                              );
                            })
                          : "Aucun code de ce type généré"}
                      </ul>
                    )}
                  </div>
                )}
                {choix == "eco" && (
                  <div>
                    {load ? (
                      <ul
                        class="list-group mt-4"
                        style={{
                          marginLeft: 20,
                          display: "flex",
                          alignItems: "center",
                          paddingBottom: 40,
                        }}
                      >
                        <div
                          class="spinner-border"
                          role="status"
                          style={{ marginLeft: 20 }}
                        >
                          <span class="visually-hidden"></span>
                        </div>
                      </ul>
                    ) : (
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
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    flex: 1,
                                    borderWidth: 1,
                                    borderColor: "gold",
                                    borderStyle: "solid",
                                    borderRadius: 10,
                                    padding: 10,
                                    marginBottom: 10,
                                  }}
                                >
                                  <div
                                    style={{
                                      flex: 1,
                                      flexDirection: "row",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                    }}
                                  >
                                    <div style={{ fontSize: 12 }}>
                                      Code à partager :
                                    </div>
                                    <div
                                      style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        border: "1px solid #CEA55D",
                                        borderRadius: 5,
                                        width: "40%",
                                        marginLeft: 10,
                                      }}
                                    >
                                      {el.pass}
                                    </div>
                                    <button
                                      style={{
                                        marginLeft: 10,
                                        backgroundImage:
                                          "url(" +
                                          "https://zupimages.net/up/22/15/f0wu.png" +
                                          ")",
                                        backgroundPosition: "center",
                                        backgroundSize: "cover",
                                        backgroundRepeat: "no-repeat",
                                        border: "none",
                                        borderRadius: 5,
                                        color: "black",
                                        textAlign: "center",
                                        textDecoration: "none",
                                        display: "inline-block",
                                        fontSize: 14,
                                        paddingRight: 10,
                                        paddingLeft: 10,
                                        cursor: "pointer",
                                      }}
                                      onClick={() => handleCopyClick(el.pass)}
                                    >
                                      <span>
                                        {isCopied ? "Copié !" : "Copier"}
                                      </span>
                                    </button>
                                  </div>
                                  <div
                                    style={{
                                      display: "flex",
                                      flex: 1,
                                      alignItems: "center",
                                      justifyContent: "center",
                                      marginTop: 10,
                                    }}
                                  >
                                    <input
                                      type="email"
                                      placeholder=" Partager par email"
                                      value={email[el.pass]}
                                      onChange={(e) =>
                                        setEmail({
                                          ...email,
                                          [el.pass]: e.target.value,
                                        })
                                      }
                                      id="email"
                                      name="email"
                                      style={{
                                        border: "1px solid #CEA55D",
                                        borderRadius: 5,
                                      }}
                                    />
                                    <img
                                      onClick={() => sendByMail(el.pass)}
                                      src={require("../../assets/images/envoyer.png")}
                                      alt=""
                                      style={{
                                        width: 80,
                                        height: 25,
                                        cursor: "pointer",
                                        marginLeft: 10,
                                        marginRight: 10,
                                      }}
                                    />
                                    <img
                                      onClick={() => deleteEco(el.pass)}
                                      src={require("../../assets/images/supprimer.png")}
                                      alt=""
                                      style={{
                                        width: 70,
                                        height: 20,
                                        cursor: "pointer",
                                      }}
                                    />
                                  </div>
                                </li>
                              );
                            })
                          : "Aucun code de ce type généré"}
                      </ul>
                    )}
                  </div>
                )}
                {choix == "pro" && (
                  <div>
                    {load ? (
                      <ul
                        class="list-group mt-4"
                        style={{
                          marginLeft: 20,
                          display: "flex",
                          alignItems: "center",
                          paddingBottom: 40,
                        }}
                      >
                        <div
                          class="spinner-border"
                          role="status"
                          style={{ marginLeft: 20 }}
                        >
                          <span class="visually-hidden"></span>
                        </div>
                      </ul>
                    ) : (
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
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    flex: 1,
                                    borderWidth: 1,
                                    borderColor: "gold",
                                    borderStyle: "solid",
                                    borderRadius: 10,
                                    padding: 10,
                                    marginBottom: 10,
                                  }}
                                >
                                  <div
                                    style={{
                                      flex: 1,
                                      flexDirection: "row",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                    }}
                                  >
                                    <div style={{ fontSize: 12 }}>
                                      Code à partager :
                                    </div>
                                    <div
                                      style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        border: "1px solid #CEA55D",
                                        borderRadius: 5,
                                        width: "40%",
                                        marginLeft: 10,
                                      }}
                                    >
                                      {el.pass}
                                    </div>
                                    <button
                                      style={{
                                        marginLeft: 10,
                                        backgroundImage:
                                          "url(" +
                                          "https://zupimages.net/up/22/15/f0wu.png" +
                                          ")",
                                        backgroundPosition: "center",
                                        backgroundSize: "cover",
                                        backgroundRepeat: "no-repeat",
                                        border: "none",
                                        borderRadius: 5,
                                        color: "black",
                                        textAlign: "center",
                                        textDecoration: "none",
                                        display: "inline-block",
                                        fontSize: 14,
                                        paddingRight: 10,
                                        paddingLeft: 10,
                                        cursor: "pointer",
                                      }}
                                      onClick={() => handleCopyClick(el.pass)}
                                    >
                                      <span>
                                        {isCopied ? "Copié !" : "Copier"}
                                      </span>
                                    </button>
                                  </div>
                                  <div
                                    style={{
                                      display: "flex",
                                      flex: 1,
                                      alignItems: "center",
                                      justifyContent: "center",
                                      marginTop: 10,
                                    }}
                                  >
                                    <input
                                      type="email"
                                      placeholder=" Partager par email"
                                      value={email[el.pass]}
                                      onChange={(e) =>
                                        setEmail({
                                          ...email,
                                          [el.pass]: e.target.value,
                                        })
                                      }
                                      id="email"
                                      name="email"
                                      style={{
                                        border: "1px solid #CEA55D",
                                        borderRadius: 5,
                                      }}
                                    />
                                    <img
                                      onClick={() => sendByMail(el.pass)}
                                      src={require("../../assets/images/envoyer.png")}
                                      alt=""
                                      style={{
                                        width: 80,
                                        height: 25,
                                        cursor: "pointer",
                                        marginLeft: 10,
                                        marginRight: 10,
                                      }}
                                    />
                                    <img
                                      onClick={() => deletePro(el.pass)}
                                      src={require("../../assets/images/supprimer.png")}
                                      alt=""
                                      style={{
                                        width: 70,
                                        height: 20,
                                        cursor: "pointer",
                                      }}
                                    />
                                  </div>
                                </li>
                              );
                            })
                          : "Aucun code de ce type généré"}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div style={{ marginLeft: 10 }}>
              <img
                onClick={payer}
                src={require("../../assets/images/devis.png")}
                alt=""
                style={{ width: 150, marginTop: 2, cursor: "pointer" }}
              />
            </div>
          </div>
        </div>
      </div>
      <button
        type="button"
        class="btn btn-primary"
        data-toggle="modal"
        data-target="#exampleModal"
      >
        Launch demo modal
      </button>

      <div
        class="modal fade"
        id="exampleModal"
        tabindex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">
                Modal title
              </h5>
              <button
                type="button"
                class="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">...</div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-dismiss="modal"
              >
                Close
              </button>
              <button type="button" class="btn btn-primary">
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Gestion;
