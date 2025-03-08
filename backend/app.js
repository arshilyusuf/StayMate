const express = require("express");
const app = express();
const cors = require('cors')
const morgan = require('morgan')
const path = require('path')
const globalErrorHandler = require("./controllers/errorController");
const cookieParser = require("cookie-parser")

const userRouter = require('./routes/userRoutes')
const requestRouter = require('./routes/requestRoutes')
const roomRouter = require('./routes/roomRoutes')

app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.static(`${__dirname}/public`));
app.use(cookieParser()); 
app.use(
  cors({
    origin: "http://localhost:5173", 
    credentials: true, 
  })
);


app.use(morgan("dev")); 

app.use("/users", userRouter);
app.use("/requests", requestRouter);
app.use("/rooms", roomRouter)
app.use(globalErrorHandler);
module.exports = app;
