const updateUserPasswordValidation = data => {
  const errors = {};

  if (!data.currentPassword) {
    errors.currentPassword = "current password is required";
  } else if (data.currentPassword.length < 4) {
    errors.currentPassword = "password can't be less than 4 characters";
  }

  if (!data.newPassword) {
    errors.newPassword = "new password is required";
  } else if (data.newPassword.length < 4) {
    errors.currentPassword = "new password can't be less than 4 characters";
  }

  if (!data.repeatPassword) {
    errors.repeatPassword = "repeat password is required";
  } else if (data.repeatPassword.length < 4) {
    errors.currentPassword = "repeat password can't be less than 4 characters";
  }

  return errors;
};

module.exports = updateUserPasswordValidation;
