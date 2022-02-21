import React, { Component } from "react";
import Posts from "../../Sections/Posts";

class Forbidden extends Component {
  render() {
    return (
      // Blog section start
      <section className="blog">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 col-md-10 m-auto">
              <div className="sec-heading">
                <h3 className="sec-title">
                  Vous n'avez pas accès à cette page
                </h3>
                <p>...</p>
              </div>
            </div>
          </div>

          {/* Posts */}
          <Posts />
        </div>
      </section>
      // Blog section end
    );
  }
}

export default Forbidden;
