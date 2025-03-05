const registerValidate = data => {
  const errors = {};
  if (!data.username) {
    errors.username = "username is required";
  } else if (data.username.length < 3) {
    errors.username = "username can't be less than 3 characters";
  } else if (data.username.length > 25) {
    errors.username = "username can't be more than 25 characters";
  }

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

module.exports = registerValidate;
