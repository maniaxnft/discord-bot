const mongoose = require("mongoose");

const trackedSalesSchema = mongoose.Schema({
  transactionHash: Number,
});
const trackedSalesModel = mongoose.model("tracked-sales", trackedSalesSchema);

module.exports = {
  trackedSalesModel,
};
