import mongoose from "mongoose";

const mongoDB = async() => {
    try{
        const connection = await mongoose.connect(process.env.MONGODB_URL);
        console.log("mongoose connected successfull", connection.connection.host)
    }
    catch(e){
        console.log("mongoose connection failed", e.message);
    }
}
export default mongoDB;