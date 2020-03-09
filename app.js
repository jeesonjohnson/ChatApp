const subdomain = require('express-subdomain');
const express = require('express');
const bodyParser = require('body-parser');

const userRouter = require('./routes/userRoutes');
const companyRouter = require('./routes/companyRoutes');

const app = express();

//Bodyparser middleware
app.use(
    bodyParser.urlencoded({
        extended: false
    })
);
app.use(bodyParser.json());

//Routes
app.use('/users', userRouter);
app.use('/companies', companyRouter);

app.get('*', (req, res) => {
    res.send("Route not found");
});

module.exports = app;