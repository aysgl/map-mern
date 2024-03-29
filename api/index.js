const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const PinRoute = require("./routes/pins");
const UserRoute = require("./routes/users");
const cors = require("cors");
const app = express();

dotenv.config();

app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDb connect success"))
  .catch((err) => console.log(err));

app.use("/api/pins", PinRoute);
app.use("/api/users", UserRoute);

app.listen(8080, () => {
  console.log("Backend server is running on port 8080!");
});
