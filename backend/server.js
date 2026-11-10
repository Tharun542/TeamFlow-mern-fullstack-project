import app from "./app.js";
import 'dotenv/config';
import mongoDB from "./config/database.js";

const PORT = process.env.PORT;

const server = async() => {
    try{
        await mongoDB();

        app.listen(PORT, ()=> {
            console.log(`TeamFlow server running on the ${PORT}`);
        })
    }
    catch(error){
        console.log("sever failed", error.message);
    }
}
server()