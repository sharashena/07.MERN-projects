import { registerInputs } from "../../helpers/auth";
import { Link } from "react-router";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { hideAlert } from "../../redux/features/auth/authSlice";
import { registerUserThunk } from "../../redux/features/auth/authThunk";
import { registerValidation } from "../../validations";
import { useNavigate } from "react-router";

const Register = () => {
  const [fields, setFields] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const { loading, alert } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  const handleChange = e => {
    const name = e.target.name;
    const value = e.target.value;
    setFields({ ...fields, [name]: value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const fieldsErrors = registerValidation(fields);
    if (Object.keys(fieldsErrors).length > 0) {
      setErrors(fieldsErrors);
      const timeout = setTimeout(() => {
        setErrors(() => ({ username: "", email: "", password: "" }));
      }, 2000);
      return () => clearTimeout(timeout);
    } else {
      const result = await dispatch(
        registerUserThunk({ url: "auth/register", params: fields })
      );

      if (registerUserThunk.fulfilled.match(result)) {
        setFields({
          username: "",
          email: "",
          password: "",
        });
        navigate("/login");
      }

      const timeout = setTimeout(() => {
        dispatch(hideAlert());
      }, 3000);
      return () => clearTimeout(timeout);
    }
  };

  return (
    <section className="section form-section">
      <form className="form-group" onSubmit={handleSubmit}>
        {alert.show && (
          <p className={`alert alert-${alert.type}`}>{alert.msg}</p>
        )}
        {registerInputs.map(({ title, name, type }, index) => {
          return (
            <article className="form-control" key={index}>
              <div className="input-container">
                <input
                  type={type}
                  name={name}
                  className={`auth-input ${errors[name] ? "field-error" : ""}`}
                  placeholder=""
                  value={fields[title]}
                  onChange={handleChange}
                  disabled={loading}
                />
                <h5>{title}</h5>
              </div>
            </article>
          );
        })}
        <button className="btn btn-block auth-btn" disabled={loading}>
          {loading ? <div className="spinner" /> : "register"}
        </button>
        <p className="auth-question">
          already a member?{" "}
          <Link to={"/login"} className="auth-link-btn">
            login
          </Link>
        </p>
      </form>
    </section>
  );
};

export default Register;
