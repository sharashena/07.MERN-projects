import { loginInputs } from "../../helpers/auth";
import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { hideAlert } from "../../redux/features/auth/authSlice";
import { loginUserThunk } from "../../redux/features/auth/authThunk";
import { currentUserThunk } from "../../redux/features/users/usersThunk";
import { loginValidation } from "../../validations";
import Cookies from "js-cookie";

const Login = () => {
  const { loading, alert } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  const [fields, setFields] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = e => {
    const name = e.target.name;
    const value = e.target.value;
    setFields({ ...fields, [name]: value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const fieldsErrors = loginValidation(fields);
    if (Object.keys(fieldsErrors).length > 0) {
      setErrors(fieldsErrors);
      const timeout = setTimeout(() => {
        setErrors({ email: "", password: "" });
      }, 2000);
      return () => clearTimeout(timeout);
    } else {
      const result = await dispatch(
        loginUserThunk({ url: "auth/login", params: fields })
      );

      if (loginUserThunk.fulfilled.match(result)) {
        setFields({ email: "", password: "" });

        const user = await dispatch(currentUserThunk());
        Cookies.set("user", JSON.stringify(user), { expires: 1 });

        const timeout = setTimeout(() => {
          navigate("/");
          dispatch(hideAlert());
        }, 1000);
        return () => clearTimeout(timeout);
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
        {loginInputs.map(({ title, name, type }, index) => {
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
          {loading ? <div className="spinner" /> : "login"}
        </button>
        <p className="auth-question">
          not a member yet?{" "}
          <Link to={"/register"} className="auth-link-btn">
            register
          </Link>
        </p>
        <p className="auth-question">
          forgot password?{" "}
          <Link to={"/forgot-password"} className="auth-link-btn">
            click here
          </Link>
        </p>
      </form>
    </section>
  );
};

export default Login;
