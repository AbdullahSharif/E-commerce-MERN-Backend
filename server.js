const app = require("./app");
const dotenv = require("dotenv");
dotenv.config();
const connectDatabase = require("./database");
connectDatabase();

// handle uncaught exception.
process.on("uncaughtException", err => {
    console.log(`Error : ${err}`);
    console.log("Shutting down the server!");
    server.close(() => {
        process.exit(1);
    })
})


const PORT = 9000 || process.env.PORT;

const server = app.listen(PORT, () => console.log(`Listening at port : ${PORT}`));

// unhandled rejection.

process.on("unhandledRejection", err => {
    console.log(`Error : ${err}`);
    console.log("Shutting Down the Server!");

    // close the server.
    server.close(() => {
        process.exit(1);
    })
})

