import mongoose from 'mongoose';
import {DB_URI, NODE_ENV }  from '../config/env.js';
import process from 'process';

if(!DB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside env.<development/production.loca>l');   

}

const connectToDatabase  = async ()  => {
    try {
        await mongoose.connect(DB_URI);
        console.log(`Connected to MongoDB in ${NODE_ENV} mode`);

    } catch (error) {
        console.error('Error connecting to database: ', error);
        process.exit(1);

    }
}

export default connectToDatabase;