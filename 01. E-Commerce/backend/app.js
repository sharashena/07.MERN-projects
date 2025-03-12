require("dotenv").config();
const express = require("express");
const connectDB = require("./db");
const errorMiddleware = require("./middlewares/errorMiddleware");
const notFoundMiddleware = require("./middlewares/notFoundMiddleware");
const { authMiddleware } = require("./middlewares/authMiddleware");
const cloudinary = require("cloudinary").v2;
const path = require("path");

cloudinary.config({
  cloud_name: "e-commerce-images",
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// rest of packages
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const cookies = require("cookie-parser");

// routes
const authRouter = require("./routes/authRoutes");
const usersRouter = require("./routes/usersRoute");
const productsRouter = require("./routes/productsRoute");
const commentsRouter = require("./routes/commentsRoute");
const ordersRoute = require("./routes/ordersRoute");

const app = express();
const port = process.env.PORT || 5000;
const url = process.env.MONGO_URI;

app.use("/assets", express.static(path.join(__dirname, "assets")));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(morgan("tiny"));
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? process.env.CLIENT_URL
        : "http://localhost:5173",
    credentials: true,
  })
);
app.use(helmet());
app.use(cookies(process.env.JWT_SECRET));

// middlewares
app.use("/api/auth", authRouter);
app.use("/api/users", authMiddleware, usersRouter);
app.use("/api/products", authMiddleware, productsRouter);
app.use("/api/comments", authMiddleware, commentsRouter);
app.use("/api/orders", authMiddleware, ordersRoute);

// error middlewares
app.use(errorMiddleware);
app.use(notFoundMiddleware);

const start = async () => {
  try {
    await connectDB(url);
    app.listen(port, console.log(`Server listening on port: ${port}`));
  } catch (error) {
    console.log(error.message);
  }
};
start();
