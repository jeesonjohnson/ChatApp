const subdomain = require("express-subdomain");
const express = require("express");
const bodyParser = require("body-parser");
//Error handling utils
const AppError = require("./utils/appError");
const globalErrorhandler = require("./utils/errorController")
//Custom routes
const userRouter = require("./routes/userRoutes");
const companyRouter = require("./routes/companyRoutes");

const app = express();

//Bodyparser middleware
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());

//Routes
app.use("/users", userRouter);
app.use("/companies", companyRouter);

app.get("*", (req, res, next) => {
  next(new AppError(`The route ${req.originalUrl} is not defined`,404));
});

app.use(globalErrorhandler);

module.exports = app;
