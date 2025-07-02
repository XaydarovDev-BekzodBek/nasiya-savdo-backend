const {connect} = require("mongoose")

const ConnectToMongodb = async () => {
  try {
    const url = process.env.MONGO_URL || "";
    await connect(url);
    console.log("mongodb is connected");
  } catch (error) {
    console.error("mongoose connection error", error.message);
  }
};


module.exports = ConnectToMongodb
