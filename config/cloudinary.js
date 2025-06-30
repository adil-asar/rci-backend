import { v2 as cloudinary } from "cloudinary";


// Cloudinary configuration
 const cloud_name =  "dzitckiqp"
const api_key = '587358547663155'
 const api_secret = "ZFeskMQI-1tGmwxS-2_xAzAVnxo"

 cloudinary.config({
    cloud_name,
    api_key,
    api_secret,
 });

 export default cloudinary;