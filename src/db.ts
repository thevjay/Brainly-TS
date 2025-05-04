import mongoose, { model, Schema } from "mongoose";
import dotenv from 'dotenv';

dotenv.config(); // Load env vars before using them

const MONGODB = process.env.MONGODB_URI!

mongoose.connect(MONGODB)

// Define the schema
const UserSchema = new Schema({
    username: {
        type: String,
        unique: true
    },
    password: {
        type: String
    }
});

// Create and export the model
export const UserModel = model("User", UserSchema);

const ContentSchema = new Schema({
    title: String,
    link: String,
    tags: [{
        type: mongoose.Types.ObjectId,
         ref:'Tag'
    }],
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
})

export const ContentModel = model("Content",ContentSchema)