const mongoose = require("mongoose");
const { Sequelize } = require("sequelize");

// Determines which database to connect to
const connectDB = async () => {
  if (process.env.DB_TYPE === "mongodb") {
    try {
      await mongoose.connect(process.env.MONGO_DB, {
        // useNewUrlParser: true,
        // useUnifiedTopolgy: true,
      });
      console.info("Connected to MongoDB");
    } catch (error) {
      console.error("Error connecting to MongoDB:", error);
      process.exit(1);
    }
  } else if (process.env.DB_TYPE === "postgres") {
    try {
      const sequelize = new Sequelize(
        process.env.POSTGRES_DB,
        process.env.POSTGRES_USER,
        process.env.POSTGRES_PASSWORD,
        {
          host: process.env.POSTGRES_HOST,
          dialect: "postgres",
        }
      );
      await sequelize.authenticate();
      console.info("Conneted to PostgreSQL");
    } catch (error) {
      console.error("Error connecting to PostgreSQL:", error);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
