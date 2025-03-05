const createProductValidation = data => {
  const errors = {};
  const allowedCompanies = ["marcos", "liddy", "ikea", "caressa"];
  const allowedCategories = [
    "living room",
    "kitchen",
    "bedroom",
    "dining",
    "office",
    "kids",
  ];

  if (!data.name) {
    errors.name = "please provide product name";
  } else if (data.name.length > 25) {
    errors.name = "product name can't be more than 25 characters";
  } else if (data.name.length < 3) {
    errors.name = "product name can't be less than 3 characters";
  }

  if (!data.company) {
    errors.company = "please provide product company";
  } else if (!allowedCompanies.includes(data.company)) {
    errors.company = "product company is invalid";
  }

  if (!data.category) {
    errors.category = "please provide product category";
  } else if (!allowedCategories.includes(data.category)) {
    errors.category = "product category is invalid";
  }

  if (!data.price) {
    errors.price = "please provide product price";
  }

  if (!data.colors) {
    errors.colors = "please provide product colors";
  }

  if (!data.stock) {
    errors.stock = "please provide product stock";
  }

  return errors;
};

module.exports = createProductValidation;
