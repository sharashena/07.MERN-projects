const express = require("express");
const router = express.Router();
const {
  createProduct,
  getAllProducts,
  getSingleProduct,
  getFilteredProducts,
  getCurrentUserProducts,
  updateProduct,
  deleteProduct,
} = require("../controllers/productsController");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
});

router
  .route("/")
  .post(upload.array("images", 10), createProduct)
  .get(getAllProducts);

router.get("/filteredProducts", getFilteredProducts);
router.get("/currentUserProducts", getCurrentUserProducts);
router
  .route("/:id")
  .get(getSingleProduct)
  .patch(upload.array("images", 10), updateProduct)
  .delete(deleteProduct);

module.exports = router;
