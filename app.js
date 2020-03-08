const express = require('express');
const bodyParser = require('body-parser');

const userRouter = require('./routes/userRoutes');

const app = express();


//Bodyparser middleware
app.use(
    bodyParser.urlencoded({
        extended: false
    })
);
app.use(bodyParser.json());

//Routes
app.use('/api/1.0.0/users', userRouter);

module.exports = app;
