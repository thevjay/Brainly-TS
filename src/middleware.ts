import {Request,Response, NextFunction } from "express";
import jwt from "jsonwebtoken"

export const userMiddleware = (req: Request,res: Response,next: NextFunction)=>{
    try{
        const header = req.headers["authorization"]?.split(" ")[1];
        // header give me = Beaer <token>
        console.log(header)
        const decoded = jwt.verify(header as string,"fsd")
        if(decoded) {
            //@ts-ignore
            req.userId = decoded.id;
            next();
        }else {
            res.status(403).json({
                message: "You are not logged in"
            })
        }
    }
    catch(err){
        console.error(err)
    }
    
}   


// override the types of the express request object