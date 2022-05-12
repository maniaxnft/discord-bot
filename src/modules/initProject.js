const mongoose = require("mongoose");

const init = async () => {
  try {
    await connectToMongo();
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

module.exports = init;
