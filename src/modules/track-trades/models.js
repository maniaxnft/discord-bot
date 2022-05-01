const mongoose = require("mongoose");

const trackedSalesSchema = mongoose.Schema({
  transactionHash: {
    type: String,
    unique: true,
  },
});
const trackedSalesModel = mongoose.model("tracked-sales", trackedSalesSchema);

module.exports = {
  trackedSalesModel,
};
