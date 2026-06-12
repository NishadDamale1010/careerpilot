const mongoose = require('mongoose');
const connectDB = async()=>{
    console.log("connecting the DB");
    try{
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB connected successfully");
    }catch(error){
        console.error(`error during db connection: ${error}`);
        process.exit(1);
    }
}
module.exports=connectDB;