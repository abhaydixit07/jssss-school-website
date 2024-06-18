import { MongoClient } from "mongodb";
import env from "dotenv"
let dbConnection;
env.config()
// const url = 'mongodb://127.0.0.1:27017/agsss-filename'
const url = process.env.MONGO_ATLAS_URL
export async function connectToDb(cb) {
    try {
        const client = await MongoClient.connect(url);
        dbConnection = client.db();
        console.log("Connected to the database");
        return cb();
    } catch (err) {
        console.error("Error connecting to the database:", err);
        return cb(err);
    }
}
export function getDb(){
    return dbConnection;
}