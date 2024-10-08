import User from '../models/user.model';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { errorHandler } from '../utils/error';
dotenv.config();

export const signup = async (req, res,next) => {
    const {username, email, password} = req.body;
    if (!username || !email || !password || !username.length || !email.length || !password.length) {
        next(errorHandler('All fields are required', 400));
    }
    const hashedPassword = await bcrypt.hashSync(password, 10);
    const newUser = new User({
        username,
        email,
        password: hashedPassword
    });
    try{
        await newUser.save();
        res.json({message: 'Signup success! Please signin'});
    } catch (error) {
        next(error);
    }
};

export const signin = async (req, res, next) => {
    const {username, password} = req.body;
    if (!username || !password || !username.length === '' || !password.length === '') {
        next(errorHandler(400, "All fields are required"));
    }
    try {
        const validUser = await User.findOne({ username });
        if (!validUser) {
            next(errorHandler(404, "User not found"));
        }
        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if (!validPassword) {
            return next(errorHandler(400, "Invalid password"));
        }
        
        const token = jwt.sign({
            id: validUser._id, isAdmin: validUser.isAdmin
        }, process.env.JWT_SECRET); 

        const { password: pass, ...rest } = validUser._doc;



        res.status(200).cookie( 'access_token',  token,{
            httpOnly: true,
            
        }).json(rest);

    } catch (error) {
        next(error);
    }
};

export const google = async (req,res,next) => {
    const {email, name, googlePhotoUrl} = req.body;
    try {
        const user = await User.findOne({email});
        if (user){
            const token = jwt.sign({
                id:user._id, isAdmin: user.isAdmin
            }, process.env.JWT_SECRET);
            const {password, ...rest} = user._doc;
            res.status(200).cookie('access_token', token, {
                httpOnly: true
            }).json(rest);
        }else{
            const genereatedPassword = Math.random().toString(36).slice(-8); + Math.random().toString(36).slice(-8);
            const hashedPassword = await bcrypt.hashSync(genereatedPassword, 10);
            const newUser = new User({
                username:name.toLowerCase().split(' ').join('') + Math.random().toString(9).slice(-4),
                email,
                password: hashedPassword,
                profilePicture: googlePhotoUrl,
            });
            await newUser.save();
            const token = jwt.sign({
                id: newUser._id, isAdmin: newUser.isAdmin
            }, process.env.JWT_SECRET);
            const {password, ...rest} = newUser._doc;
            res.status(200).cookie('access_token', token, {
                httpOnly: true
            }).json(rest);
        }
    } catch (error) {
        next(error);
    }
};