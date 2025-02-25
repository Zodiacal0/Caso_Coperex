import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import express from "express";
import { connectionDB } from "./mongo.js";
import authRoutes from "../src/Auth/auth.routes.js"
import userRoutes from "../src/user/user.routes.js"
import { userSeeder } from "../src/seeders/user.seeder.js";


const middlewares = (app) => {
    app.use(express.urlencoded({extended:false}));
    app.use(express.json());
    app.use(helmet());
    app.use(cors());
    app.use(morgan("dev"));

};

const routes = (app) =>{
    app.use("/casocoperex/v1/auth", authRoutes);
    app.use("/casocoperex/v1/user", userRoutes);
}

const connectionMongo = async() =>{
    try{
        await connectionDB();
    }catch(error){
        console.log(`Data Base connection is failed, please try again ${e}`);
    }
};

export const initServer = () => {
    const app = express();
    const timeInit = Date.now();
    try{
        middlewares(app);
        connectionMongo();
        routes(app);
        app.listen(process.env.PORT);
        userSeeder();
        const elapsedTime = Date.now() - timeInit;
        console.log(`Server running on port ${process.env.PORT} ${elapsedTime}ms`);
    }catch(error){
        console.log(`Server failed to start: ${error}`);
    }
};