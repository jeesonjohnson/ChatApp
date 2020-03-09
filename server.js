const mongoose = require("mongoose");
const dotenv = require("dotenv");

//Set environment variables
dotenv.config({ path: "./config.env" });

const app = require("./app");

//DB config
const db = process.env.MONGO_URI.replace(
  "<USER>",
  process.env.MONGO_USER
).replace("<PASSWORD>", process.env.MONGO_PASSWORD);

//Connect to MongoDB
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB successfully connected"))
  .catch(err => console.log(err));

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
