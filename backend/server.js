const app = require("./app");
const dotenv = require("dotenv");
const dbConnection = require("./config/database");
const ErrorHandler = require("./utils/errorHandler");
// const cors = require("cors");
// const corsOptions = {
//     origin: '*',
//     mode: "cors",
//     credentials: true,            //access-control-allow-credentials:true
//     optionSuccessStatus: 200,
// }
// app.use(cors(corsOptions))


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




// if any unhandled Promise Rejections occur
process.on("unhandledRejection", (err) => {
    console.log(`Error occured: ${err.stack}`);
    console.log("Shutting down the server due to unhandled promise rejection");
    server.close();
    process.exit(1);
})

const server = app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});

