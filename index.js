import { configDotenv } from 'dotenv';
configDotenv();
import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import user_router from "./Route/user_route.js";
import admin_router from "./Route/admin_route.js";
import bodyParser from "body-parser"

const port = process.env.PORT;
const app = express()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({ extended: true }))
app.use(cors())

async function main() {
    try {
        await mongoose.connect(process.env.MONGODB_CONNECT)
        console.log("Database Connected...✅️");
    } catch (error) {
        console.log(error);
    }
}

main();

app.use("/api/users", user_router);
app.use("/api/admin", admin_router);

app.listen(port, (error) => {
    if (error) {
        console.log("Error while listening to the server:", error);
    } else {
        console.log("Server is listening on http://localhost:" + port);
    }
});
