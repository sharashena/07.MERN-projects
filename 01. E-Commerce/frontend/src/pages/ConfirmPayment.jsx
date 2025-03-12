import React from "react";
import { Link } from "react-router";

const ConfirmPayment = () => {
  return (
    <div className="confirm-payment">
      <article className="section-center">
        <h1>payment successfull</h1>
        <Link to={"/"} className="btn btn-block">
          back to home
        </Link>
      </article>
    </div>
  );
};

export default ConfirmPayment;
