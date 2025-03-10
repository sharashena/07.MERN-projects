import { useNavigate } from "react-router";
import { FiArrowLeftCircle } from "react-icons/fi";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { hideAlert } from "../../redux/features/auth/authSlice";
import { forgotPasswordThunk } from "../../redux/features/auth/authThunk";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const { loading, alert } = useSelector(state => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async e => {
    e.preventDefault();
    const errors = {};

    if (!email) {
      errors.email = "email is required";
      setError(errors.email);
      const timeout = setTimeout(() => {
        setError("");
      }, 2000);
      return () => clearTimeout(timeout);
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Please provide a valid email";
      setError(errors.email);
      const timeout = setTimeout(() => {
        setError("");
      }, 2000);
      return () => clearTimeout(timeout);
    }
    const result = await dispatch(
      forgotPasswordThunk({ url: "auth/forgot-password", params: { email } })
    );

    if (forgotPasswordThunk.fulfilled.match(result)) {
      setEmail("");
      const timeout = setTimeout(() => {
        dispatch(hideAlert());
      }, 3000);
      return () => clearTimeout(timeout);
    }
    const timeout = setTimeout(() => {
      dispatch(hideAlert());
    }, 3000);
    return () => clearTimeout(timeout);
  };

  return (
    <section className="section form-section">
      <form className="form-group" onSubmit={handleSubmit}>
        <h3 className="forgotpass-title">forgot password</h3>
        <p>
          after clicking button, email verification link will be send to your
          email account, check your mail in inbox. You have to verify your email
          first, after that you will be able to log in your account.
        </p>
        <button className="back-btn" onClick={() => window.history.back(-1)}>
          <FiArrowLeftCircle />
        </button>
        {alert.show && (
          <p className={`alert alert-${alert.type}`}>{alert.msg}</p>
        )}
        <article className="form-control">
          <div className="input-container">
            <input
              type="text"
              name="email"
              className={`auth-input ${error ? "field-error" : ""}`}
              placeholder=""
              value={email}
              onChange={e => setEmail(e.target.value)}
              disabled={loading}
            />
            <h5>email</h5>
          </div>
        </article>
        <button className="btn btn-block auth-btn" disabled={loading}>
          {loading ? <div className="spinner" /> : "send verification link"}
        </button>
      </form>
    </section>
  );
};

export default ForgotPassword;
