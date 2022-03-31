const mongoose = require("mongoose");

const init = async () => {
  try {
    await mongoose.connect(`mongodb://localhost:27017/${process.env.APP_NAME}`);
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
};

module.exports = {
  init,
};
