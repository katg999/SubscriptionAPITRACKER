import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'; 
import { JWT_EXPIRES_IN, JWT_SECRET } from '../config/env.js';
import User from '../model/user.model.js';  



export const signUp = async (req, res, next) => {

const session = await mongoose.startSession();
session.startTransaction();  // atomic operations;

try {


   //check the password  if the user already exists
    const { name, email, password} = req.body;

    const existingUser = await User.findOne({email});
    if(existingUser) {
        const error = new Error ('User already exists with this email');
        error.statusCode = 409;
        throw error;

    }

    //Hash password 
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUsers = await User.create([{name, email, password: hashedPassword}], {session});
    await session.commitTransaction();

    const token =  jwt.sign({userId: newUsers[0]._id},  JWT_SECRET, {expiresIn : JWT_EXPIRES_IN});
    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: {
            user: newUsers[0],
            token
        }
    });


}  catch(error) {
    await session.abortTransaction();
    
    next(error);

}


}

export const signIn = async (req, res, next) => {

    try {
        const { email, password } = req.body;

        const user =  await User.findOne({ email });
        if(!user) {
            const error = new Error('User not found with this email');
            error.statusCode = 404;
            throw error;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid) {
            const error = new Error('Invalid password');
            error.statusCode = 401;
            throw error;
        }

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        res.status(200).json({
            success: true,
            message: 'User signed in successfully',
            data: {
                user,
                token
            }
        });


    }  catch(error){
        next(error);
 
    }


    req,res,next;

}


export const signOut = async (req, res, next) => {
    req,res,next;

}