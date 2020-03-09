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
//Allow parsing of body elements as JSON Objects
app.use(bodyParser.json());

app.use((req,res,next)=>{
  req.requestTime = new Date().toISOString;
  next();
})

//Routes
app.use("/users", userRouter);
app.use("/companies", companyRouter);

app.get("*", (req, res, next) => {
  next(new AppError(`The route ${req.originalUrl} is not defined`,404));
});

app.use(globalErrorhandler);

module.exports = app;
