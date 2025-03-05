const resetPasswordValidation = data => {
  const errors = {};

  if (!data.newPassword) {
    errors.newPassword = "new password is required";
  } else if (data.newPassword.length < 4) {
    errors.password = "new password can't be less than 4 characters";
  }

  if (!data.repeatPassword) {
    errors.repeatPassword = "repeat password is required";
  } else if (data.repeatPassword.length < 4) {
    errors.password = "repeat password can't be less than 4 characters";
  }

  return errors;
};

module.exports = resetPasswordValidation;