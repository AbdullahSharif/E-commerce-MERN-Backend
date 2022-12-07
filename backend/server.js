const app = require("./app");
const dotenv = require("dotenv");
const dbConnection = require("./config/database");

// if any uncaught exceptions occur
process.on("uncaughtException", (err) => {
    console.log(`Error: ${err.message}`);
    console.log("Shutting down the server due to uncaught exception.");
    process.exit(1);

})

dotenv.config({ path: "./config/config.env" });
const PORT = process.env.PORT;

// database connection
dbConnection();


const server = app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});

// if any unhandled Promise Rejections occur
process.on("unhandledRejection", (err) => {
    console.log(`Error occured: ${err.message}`);
    console.log("Shutting down the server due to unhandled promise rejection");
    server.close(() => {
        process.exit(1);
    })
})

