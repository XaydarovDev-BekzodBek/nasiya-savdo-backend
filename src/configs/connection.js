const { connect } = require("mongoose");

const ConnectToMongodb = async () => {
  try {
    const url = process.env.MONGO_URL || "";
    await connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      connectTimeoutMS: 30000,
    });
    console.log("mongodb is connected");
  } catch (error) {
    console.error("mongoose connection error", error.message);
  }
};

module.exports = ConnectToMongodb;
