import mongoose from "mongoose";


const uri = "mongodb+srv://lytnetwork:lytnetwork%40123@lytnetwork.11yzrzs.mongodb.net/?retryWrites=true&w=majority&appName=Lytnetwork"; 
// const uri = "mongodb://localhost:27017/rci-backend"; 
const connectDatabase = async() => {
try {
    const db = await mongoose.connect(uri);
    console.log(`MongoDB connected: ${db.connection.host}`);
} catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1);
}
};

export default connectDatabase




// 1039328786603-e14ec2dg5gk29ulh4spd1c9pu65s002t.apps.googleusercontent.com client ID




// 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  secret key