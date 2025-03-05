const loginValidate = data => {
  const errors = {};

  if (!data.email) {
    errors.email = "email is required";
  } else if (!/\S+@\S+\.\S+/.test(data.email)) {
    errors.email = "Please provide a valid email";
  }

  if (!data.password) {
    errors.password = "password is required";
  } else if (data.password.length < 4) {
    errors.password = "password can't be less than 4 characters";
  }

  return errors;
};

module.exports = loginValidate;
