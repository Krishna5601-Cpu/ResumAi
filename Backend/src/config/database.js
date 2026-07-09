const mongoose = require("mongoose");

async function connectToDB() {
  try {
    mongoose.connect(process.env.MONGO_URI);

    console.log("Database Connected :) ");
  } catch (err) {
    console.log(err);
  }
}

module.exports = connectToDB;

