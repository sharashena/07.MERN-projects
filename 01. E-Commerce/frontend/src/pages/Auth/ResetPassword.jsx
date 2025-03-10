import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { resetInputs } from "../../helpers/auth";
import { useSelector, useDispatch } from "react-redux";
import { resetPasswordThunk } from "../../redux/features/auth/authThunk";
import { hideAlert } from "../../redux/features/auth/authSlice";
import { resetPasswordValidation } from "../../validations";

const ResetPassword = () => {
  const [fields, setFields] = useState({
    newPassword: "",
    repeatPassword: "",
  });
  const [errors, setErrors] = useState({
    newPassword: "",
    repeatPassword: "",
  });
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  const token = searchParams.get("token");

  const { loading, alert } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  const handleChange = e => {
    const name = e.target.name;
    const value = e.target.value;
    setFields({ ...fields, [name]: value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const fieldsErrors = resetPasswordValidation(fields);
    if (Object.keys(fieldsErrors).length > 0) {
      setErrors(fieldsErrors);
      const timeout = setTimeout(() => {
        setErrors({ newPassword: "", repeatPassword: "" });
      }, 2000);
      return () => clearTimeout(timeout);
    } else {
      const result = await dispatch(
        resetPasswordThunk({
          url: "auth/reset-password",
          params: {
            newPassword: fields.newPassword,
            repeatPassword: fields.repeatPassword,
            token,
            email,
          },
        })
      );
      if (resetPasswordThunk.fulfilled.match(result)) {
        setFields({ newPassword: "", repeatPassword: "" });
        const timeout = setTimeout(() => {
          navigate("/login");
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
      {alert.msg === "reset password link has expired" ? (
        <article className="form-group"></article>
      ) : (
        <form className="form-group" onSubmit={handleSubmit}>
          {alert.show && (
            <p className={`alert alert-${alert.type}`}>{alert.msg}</p>
          )}
          {resetInputs.map(({ title, name, type }, index) => {
            return (
              <article className="form-control" key={index}>
                <div className="input-container">
                  <input
                    type={type}
                    name={name}
                    className={`auth-input ${
                      errors[name] ? "field-error" : ""
                    }`}
                    placeholder=""
                    value={fields[name]}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  <h5>{title}</h5>
                </div>
              </article>
            );
          })}
          <button className="btn btn-block auth-btn" disabled={loading}>
            {loading ? <div className="spinner" /> : "reset password"}
          </button>
        </form>
      )}
    </section>
  );
};

export default ResetPassword;
