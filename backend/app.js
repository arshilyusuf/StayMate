const express = require("express");
const app = express();
const path = require("path");
const compression = require('compression')

// Security & Middleware
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");

// Error Handling
const globalErrorHandler = require("./controllers/errorController");
/*        CORS CONFIGURATION      */
app.use(cors({ origin: `https://stay-mate-frontend.vercel.app/`, credentials: true }));

app.use(compression())
// Routers
const userRouter = require("./routes/userRoutes");
const requestRouter = require("./routes/requestRoutes");
const roomRouter = require("./routes/roomRoutes");

// Set security HTTP headers
app.use(helmet());

// Sanitize data against NoSQL query injection
app.use(mongoSanitize());

// Prevent XSS (Cross-Site Scripting) attacks
app.use(xss());

// Rate limiting to prevent abuse (200 requests per hour)
const limiter = rateLimit({
  max: 2000,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests, please try again in an hour!",
});
app.use(limiter);

/*        GLOBAL MIDDLEWARES      */
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Body parser (limit request body size)
app.use(express.json({ limit: "10kb" }));

// URL-encoded data parser
app.use(express.urlencoded({ extended: true }));

// Cookie parser
app.use(cookieParser());

/*       STATIC FILE SERVING      */
// Serve static files from 'public' directory
app.use(express.static(`${__dirname}/public`));

// Serve uploaded images from 'uploads' directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


/*            ROUTES              */
app.use("/users", userRouter);
app.use("/requests", requestRouter);
app.use("/rooms", roomRouter);

// Global error handling middleware
app.use(globalErrorHandler);

module.exports = app;
