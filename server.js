const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();

//Bodyparser middleware
app.use(
    bodyParser.urlencoded({
        extended: false
    })
);
app.use(bodyParser.json());

//DB config
const db = require("./config/keys").mongoURI;

//Connect to MongoDB
mongoose.connect(db, {useNewUrlParser: true}
    ).then(() => console.log("MongoDB successfully connected"))
    .catch(err => console.log(err));

const port = process.env.PORT || 5000; 

app.listen(port, () => console.log(`Server running on port ${port}`));
