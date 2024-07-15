import { configDotenv } from 'dotenv';
configDotenv();
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import user_router from "./Route/user_route.js";
import admin_router from "./Route/admin_route.js";
import bodyParser from "body-parser";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";

const port = process.env.PORT || 3000;
const app = express();

// Swagger setup
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Node.js Stayfind project',
            version: '1.0.0'
        },
        servers: [
            {
                url: `http://localhost:${port}/`
            }
        ],
        tags: [
            {
                name: 'User API',
                description: 'API endpoints for users'
            },
            {
                name: 'Admin API',
                description: 'API endpoints for admin'
            }
        ]
    },
    apis: ['./Route/user_route.js', './Route/admin_route.js'] 
};

const swaggerSpec = swaggerJsDoc(options);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Database connection
async function main() {
    try {
        await mongoose.connect(process.env.MONGODB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Database Connected...✅️");
    } catch (error) {
        console.log("Database Connection Error:", error);
    }
}

main();

// Routes
app.get('/', (req, res) => {
    res.send('Welcome to StayFind...');
});

app.use("/api/users", user_router);
app.use("/api/admin", admin_router);

// Start server
app.listen(port, (error) => {
    if (error) {
        console.log("Error while listening to the server:", error);
    } else {
        console.log(`Server is listening on http://localhost:${port}`);
    }
});
