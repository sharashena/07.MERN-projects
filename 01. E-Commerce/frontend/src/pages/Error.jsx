import { Link } from "react-router";

const Error = () => {
  return (
    <section className="section error-section">
      <div className="error-center">
        <h1>404 page not found</h1>
        <Link to={"/"} className="btn btn-block">
          back to home
        </Link>
      </div>
    </section>
  );
};

export default Error;
