import express from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import {ContentModel, UserModel} from './db'

import dotenv from 'dotenv';
import { userMiddleware } from './middleware';
dotenv.config(); // Load .env into process.env

const app = express();
app.use(express.json());

app.post("/api/v1/signup",async(req,res)=>{
    // zod validation
    const username = req.body.username;
    const password = req.body.password;

    try{
        await UserModel.create({
            username: username,
            password: password
        })
    
        res.json({
            message: "User signed Up"
        })
    }
    catch(err){
        res.status(500).json({
            message: "User already exists"
        })
    }
})

app.post("/api/v1/signin",async(req,res)=>{
    const username = req.body.username;
    const password = req.body.password;

    const existingUser = await UserModel.findOne({
        username,
        password
    })

    if(existingUser){
        const token = jwt.sign({id: existingUser._id},"fsd") 
        
        res.json({
            token
        })
    } else {
        res.status(403).json({
            message: "Incorrect credentials"
        })
    }
})

app.post("/api/v1/content",userMiddleware, async(req,res)=>{
    const link = req.body.link;
    const type = req.body.type;

    await ContentModel.create({
        link,
        type,
        //@ts-ignore
        userId: req.userId,
        tags:[]
    })
     
    res.json({
        message: "Content added"
    })
})

app.get("/api/v1/content",userMiddleware,async(req,res)=>{
    try{
        // @ts-ignore
      const userId = req.userId;
      const content = await ContentModel.find({userId: userId}).populate("userId","username")

      res.json({content})
    }
    catch(err){
        res.status(500).json({ message: "Error fetching content" + err });
    }
})

app.delete("/api/v1/content",userMiddleware,async(req,res)=>{
    const contentId = req.body.contentId;

    await ContentModel.deleteMany({
        contentId,
        // @ts-ignore
        userId: req.userId
    })

    res.json({
        message:"Delete Successfully"
    })
    
})

app.post("/api/v1/brain/share",(req,res)=>{
    
})

app.post("/api/v1/brain/:shareLink",(req,res)=>{
    
})

app.listen(4000,()=>{
    console.log("Server starting 4000")
})