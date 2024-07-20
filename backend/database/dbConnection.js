import mongoose from "mongoose";

export const dbConnection = ()=>{
    mongoose.connect(process.env.MONGO_URI,{// mongo uri-> command mongosh ya mongo db 
        dbName: "MERN_STACK_JOB_SEEKING",// no space in bw
    }).then(()=>{
        console.log("connected to database")
    }).catch((err)=>{
        console.log(`error occured while connecting to databse: ${err}`)
    });
};