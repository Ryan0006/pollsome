import React from "react";
import { Link } from "react-router-dom";

const ContactMe = () => {
  return (
    <div className="page-wrap d-flex flex-row align-items-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 text-center">
            <div className="mb-4 lead">
              <span className="display-4 d-block" style={{ marginBottom: 20 }}>
                Ryan Chen
              </span>
              <p>
                <strong>Email: </strong>ryanchen0008@gmail.com
              </p>
              <p>
                <strong>Phone: </strong>(61)402900746
              </p>
            </div>
            <Link to="/" className="btn btn-link">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactMe;
