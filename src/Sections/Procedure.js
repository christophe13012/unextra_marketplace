import React, { Component } from "react";
import axios from "../axios-orders";
import Post from "../Components/Post";

class Procedure extends Component {
  render() {
    return (
      // Procedures section start
      <section className="procedures">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 col-md-10 m-auto">
              <div className="sec-heading">
                <h3 className="sec-title">Propositions et prise de contact</h3>
                <p>
                  Proposez à vos prospects des comptes en gros à des tarifs
                  intéressants ou quelques comptes gratuits pour tester nos
                  services.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      // Procedures section end
    );
  }
}

export default Procedure;
