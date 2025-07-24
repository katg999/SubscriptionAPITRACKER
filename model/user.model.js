import mongoose from 'mongoose';
const userSchema = new mongoose.Schema(
    {
        name : {
            type: String, 
            required: [true, 'User Name is required'],
            trim: true,
            minLength: 2,
            maxLength: 50
        },
        email : {
            type: String,
            required : [true, 'User Email Is required'],
            unique: true,
            lowercase: true,
            trim: true,
            minLength: 5,
            maxlength: 255,
            match: [/\S+@\S+\.\S+/, 'Please enter a valid email address']      
        },
        password : {
            type: String,
            required: [true, 'User Password is required'],
            minLength: 6,
        
        }

    },  {
        timestamps: true,});


const User = mongoose.model('User', userSchema);
export default User;


