import React, { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { getDatabase, ref, set } from "firebase/database";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";

const Appointment = () => {
  const [code, setCode] = useState(uuidv4());
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [reduction, setReduction] = useState("");
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();
    if (accountNumber == 0 || accountNumber == "") {
      toast.warn("Le nombre de compte ne peut pas être égal à 0 !", {
        position: toast.POSITION.TOP_CENTER,
      });
    } else if (reduction == "") {
      toast.warn("Merci de choisir un montant de réduction !", {
        position: toast.POSITION.TOP_CENTER,
      });
    } else {
      emailjs
        .sendForm(
          "service_281tpu8",
          "template_s7l53t7",
          e.target,
          "user_cs48fHhUC3ofs28N0k1oK"
        )
        .then(
          (result) => {
            const db = getDatabase();
            set(ref(db, "prospectEmail/" + code), {
              email,
              reduction,
              accountNumber,
            });
            toast.success("Proposition bien transmise !", {
              position: toast.POSITION.TOP_CENTER,
            });
            setAccountNumber(0);
            setEmail("");
            setReduction("");
            setCode(uuidv4());
            setName("");
          },
          (error) => {
            console.log(error.text);
          }
        );
    }
  };

  return (
    <section className="appointment">
      <div className="appointment-wrap">
        <figure>
          <img src={require("../assets/images/resto.jpg")} alt="" />
        </figure>
        <div className="appointment-form">
          <form ref={form} onSubmit={sendEmail}>
            <div className="form-field half-width">
              <input
                type="hidden"
                placeholder="code"
                required
                value={code}
                id="code"
                name="code"
              />
              <input
                type="text"
                placeholder="NOM"
                required
                onChange={(e) => setName(e.target.value)}
                value={name}
                id="name"
                name="name"
              />
              <input
                type="email"
                placeholder="Adresse Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                id="email"
                name="email"
              />
            </div>
            <div className="form-field half-width">
              <div className="select-field">
                <input
                  type="number"
                  placeholder="NOMBRE DE COMPTE"
                  required
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  id="accountNumber"
                  name="accountNumber"
                />
              </div>
            </div>
            <div className="form-field half-width">
              <div className="select-field">
                <select
                  id="reduction"
                  name="reduction"
                  value={reduction}
                  onChange={(e) => setReduction(e.target.value)}
                >
                  <option>Selectionner le %age de réduction</option>
                  <option value={0}>0%</option>
                  <option value={10}>10%</option>
                  <option value={20}>20%</option>
                  <option value={30}>30%</option>
                  <option value={40}>40%</option>
                  <option value={50}>50%</option>
                  <option value={60}>60%</option>
                  <option value={70}>70%</option>
                  <option value={80}>80%</option>
                  <option value={90}>90%</option>
                  <option value={100}>100%</option>
                </select>
              </div>
            </div>
            <input
              className="btn btn-round"
              type="submit"
              className="btn btn-primary"
              value="Envoyer la proposition"
            />
          </form>
        </div>
      </div>
    </section>
  );
};

export default Appointment;
