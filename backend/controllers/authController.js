import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const userToken = (userId) => {
    return jwt.sign(
        {userId: userId.toString()},
        process.env.JWT_SECRET,
        {expiresIn: process.env.JWT_EXPIRES_IN || '1d'}
    )
}

const userRegister = async(req, res) => {
    const {name, password, email } = req.body;

    if(!name || !email || !password){
        return res.status(400).json({
            success: false,
            message: "name, email, password are required..!"
        })
    }
    
    if(password.length < 8){
        return res.status(400).json({
            success: false,
            message: "password must be contain atleast 8 characters....!"
        })
    }

    const existingUser = await User.findOne({
        email: email
    })

    if(existingUser){
        return res.status(409).json({
            success: false,
            message: "email already registered..!"
        })
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        name: name,
        password: hashedPassword,
        email: email
    })

    return res.status(201).json({
        success: true,
        message: "user created successfully",
        data: user
    })
}



// user login function
const userLogin = async(req, res)=>{
    
    const { password, email } = req.body;

    if(!password || !email){
        return res.status(400).json({
            success: false,
            message: "email and password are required..!"
        })
    }

    const user = await User.findOne({
        email: email
    })

    if(!user){
        return res.status(401).json({
            success: false,
            message: "Invalid user credentials..!"
        })
    }


    const isPasswordValid = await bcrypt.compare(password, user.password);

    const token = userToken(user._id);

    if(!isPasswordValid){
        return res.status(401).json({
            success: false,
            message: "password or email invalid..!"
        })
    }

    return res.status(200).json({
        success: true,
        message: "user login successfully..!",
        data: user,
        token: token
    })

}

const getMe = async(req, res)=>{
    try{
        const user  = await User.findById(req.id.userid);
        if(!user){
            return res.status(404).json({
                success: false,
                message: "user not found"
            })
        }

        return res.status(200).json({
            success:true,
            message: "user found",
            user: user
        })
    }
    catch(err){
        return res.status(401).json({
            message: err.message
        })
    }
}

export {userRegister, userLogin, getMe};