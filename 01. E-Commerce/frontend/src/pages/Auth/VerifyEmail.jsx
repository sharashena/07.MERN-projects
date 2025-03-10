import { Link } from "react-router";

const VerifyEmail = () => {
  return (
    <section className="section form-section">
      <div className="form-group">
        <h1 className="verified-title">email successfully verified</h1>
        <Link className="btn btn-block verified-btn" to={"/login"}>
          back to login
        </Link>
      </div>
    </section>
  );
};

export default VerifyEmail;
