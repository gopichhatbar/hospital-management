const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME || "railway",
  process.env.DB_USER || "root",
  process.env.DB_PASS || "",
  {
    host: process.env.DB_HOST || "trolley.proxy.rlwy.net",
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 53441,
    dialect: process.env.DB_DIALECT || "mysql",
    logging: false
  }
);

sequelize.authenticate()
  .then(() => console.log("✅ Database connected..."))
  .catch(err => console.error("❌ Database connection error:", err.message));

module.exports = sequelize;
