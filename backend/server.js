const app = require("./app");
const dotenv = require("dotenv");
const dbConnection = require("./config/database");

dotenv.config({ path: "./config/config.env" });
const PORT = process.env.PORT;

// database connection
dbConnection();


app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});