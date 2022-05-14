const mongoose = require("mongoose");
const express = require("express"),
  app = express();

const init = async () => {
  try {
    await connectToMongo();
    await runHttpServer();
  } catch (e) {
    throw new Error(e);
  }
};

const connectToMongo = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Successfully connected to mongodb!");
  } catch (e) {
    throw new Error(e);
  }
};

const runHttpServer = () => {
  app.get("/", (req, res) => {
    res.send("healthy");
  });
  app.listen(
    process.env.PORT,
    console.log(`Server started on port ${process.env.PORT}`)
  );
};

module.exports = init;
