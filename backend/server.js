import app from "./app.js";
import cloudinary from "cloudinary";
import { config } from "dotenv";

// Load environment variables
config({ path: "./config/config.env" });
//cloudinary setup for `file send 
cloudinary.v2.config({
    cloud_name:process.env.CLOUDINARY_CLIENT_NAME,
    api_key:process.env.CLOUDINARY_CLIENT_API,
    api_secret:process.env.CLOUDINARY_CLIENT_SECRET,
})

app.listen(process.env.PORT,()=>{
    console.log(`server running on port ${process.env.PORT}`);
}); 