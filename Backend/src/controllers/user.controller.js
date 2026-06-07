import { User } from "../models/user.model.js";
import {Project} from "../models/project.model.js"
import { logger } from "../utils/logger.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { verifyJWT } from "../middlewares/authMiddleware.js";
import jwt from "jsonwebtoken"


const registerUser = async (req, res, next) => {
    try {
        const { email, name, username, password } = req.body;

        if ([email, name, username, password].some((field) => !field)) {
            throw new apiError(400, "all fields are req");
        }

        const existedUser = await User.findOne({
            $or: [{ username }, { email }],
        });

        if (existedUser) {
            throw new apiError(409, "user already exists");
        }

        const user = await User.create({
            username,
            email,
            password,
            name,
        });

        //* Automatically create the Inbox for the new user
        // This ensures every user starts with a valid "Inbox" project , must be wrapped in another try catch block to rollback
        try {
            await Project.create({
                name: "Inbox",
                owner: user._id,
                isInbox: true,
                order: 0
            });
        } catch (inboxError) {
            // Inbox failed → Rollback user creation , its like implementing manual transaction, if one fails other must fail too
            await User.findByIdAndDelete(user._id);
            throw new apiError(500, "Failed to setup account. Please try again.");
        }

        const userResponse = user.toObject();
        delete userResponse.password;
        delete userResponse.refreshToken;

        return res.status(201).json(new apiResponse(201, userResponse));
    } 
    catch (error) {
        next(error);
    }
};

const loginUser = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        if (!(username || email)) {
            throw new apiError(400, "missing username or email");
        }

        if (!password) {
            throw new apiError(400, "password is required");
        }

        const user = await User.findOne({
            $or: [{ username }, { email }],
        });

        if (!user) {
            throw new apiError(404, "user not found");
        }

        const validPassword = await user.isPasswordCorrect(password);
        
        if (!validPassword) {
            throw new apiError(401, "please enter valid password ");
        }

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        const loggedInUser = await User.findById(user._id).select(
            "-password -refreshToken",
        );

        //* send cookies

        const options = {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        };

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken",refreshToken,options)
            .json(
                new apiResponse(
                    200,
                    {
                        user: loggedInUser,
                        accessToken,
                    },
                    "user logged in successfully",
                ),
            );
    } catch (error) {
        next(error);
    }
};

const logoutUser = async(req,res,next) => {

    //first it goes to verifyJWT
   try {
    await User.findByIdAndUpdate(req.user._id,
     {
         $unset:{refreshToken : 1}
     },
     { 
         new:true
     })
 
     const options = {
         httpOnly:true,
         secure:true,
         sameSite: "none",
     }
 
     return res
     .status(200)
     .clearCookie("accessToken" , options)
     .clearCookie("refreshToken" , options)
     .json(new apiResponse(200, {} ,"user logged out successfully"))
   } catch (error) {
        next(error);
   }
};

const refreshAccessToken = async (req, res, next) => {
    try {
        const incomingToken = req.cookies.refreshToken || req.body.refreshToken;

        if (!incomingToken) {
            throw new apiError(401, "Unauthorized request: No refresh token");
        }

        let decodedToken;
        try {
            decodedToken = jwt.verify(incomingToken, process.env.REFRESH_TOKEN_SECRET);

        } catch (jwtError) {
             if (jwtError.name === 'TokenExpiredError') {
                throw new apiError(401, "Token expired"); //using an old token with same secret key
            }
            throw new apiError(401, "Invalid token");  // All other JWT errors
        }         
        
        const user = await User.findById(decodedToken?._id);

        if (!user) {
            throw new apiError(404, "Invalid refresh token: User not found");
        }

        if (incomingToken !== user.refreshToken) {
            throw new apiError(401, "Refresh token is expired or used");
        }

        const accessToken = user.generateAccessToken();
        const newRefreshToken = user.generateRefreshToken();

        
        user.refreshToken = newRefreshToken;
        await user.save({ validateBeforeSave: false });

        const options = {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        };

       
        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new apiResponse(
                    200,
                    {
                        accessToken,
                    },
                    "Access token refreshed"
                )
            );
    } catch (error) {
        
        next(error);
    }
};

const getUserProfile = async (req,res,next) => {

    const user = req.user;

    return res.status(200)
    .json(
        new apiResponse(200,user,"fetched curr user successfully")
    )
};

const changeCurrentPassword = async (req,res,next) => {

    try {
        const user = await User.findById(req.user?._id)

        const {oldPassword , newPassword} = req.body;
        
        if(!oldPassword || oldPassword.trim() === "" ||
            !newPassword || newPassword.trim() === ""){
            throw new apiError(400 , "both fields are required");
        }

        if(oldPassword === newPassword){
            throw new apiError (400, "new password cannot be same as old password")
        }

        const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

        if(!isPasswordCorrect){
            throw new apiError(401, "plz enter valid password");
        }
        
        user.password = newPassword;
        await user.save();

        user.refreshToken = undefined;
        await user.save({validateBeforeSave:false});

        const options = {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        };

        return res.status(200)
        .clearCookie("accessToken",options)
        .clearCookie("refreshToken",options)
        .json(
            new apiResponse(200,{},"password changed successfully")
        )

    } catch (error) {
        next(error);
    }
} 

const updateName = async(req,res,next) => {
    //! will use same controller for future avtar and bio updation
try {
        const {name} = req.body;
        
        if(!name || name.trim() === ""){
            throw new apiError(400, "Name cannot be empty");
        }
    
        const user = req.user;
    
        if (name) {
            if (name === user.name) {
                throw new apiError(400, "New name can't be same as existing name");
            }
            user.name = name;
        }
        
        const updatedUser = await user.save();
        
        const userResponse = {
            _id:updatedUser._id,
            name:updatedUser.name,
            username:updatedUser.username,
            email:updatedUser.email,
            createdAt:updatedUser.createdAt,
            updatedAt:updatedUser.updatedAt
        }

        return res.status(200)
        .json(new apiResponse(200,userResponse,"User account details updated successfully"));

} catch (error) {

    next(error);
}
}

const checkUniqueUsername = async (req,res,next) =>{
    try {
        
        const {username} = req.query;

        if (typeof username!== 'string' || username.trim() === "") {
            return next(new apiError(400, "Username is required"));
        }

        const existingUsername = await User.findOne({
            username:username.toLowerCase().trim()
        })

        if (existingUsername) {
            throw new apiError(409,"Username already taken, please enter a unique username")
        }

        return res.status(200).json(
            new apiResponse(200, { available: true }, "Username is available")
        );

    } catch (error) {
        next(error);
    }
}

const updateUsernameAndEmail = async (req,res,next) => {
try {
        //* we use username and email as a login so we dont want any unverified entity to come and change it 
        const {username , email, password} = req.body;
    
        if(typeof password!=="string" || password.trim() === ""){
            throw new apiError(400,"password is required for changing email and username");
        }   

        const user = await User.findById(req.user._id).select("+password");

        const validPassword = await user.isPasswordCorrect(password);
    
        if(!validPassword){
            throw new apiError (401 , "please enter a correct password");
        }

        if(username && typeof username==="string" && username.trim()!==""){
            const cleanUsername = username.trim().toLowerCase();
            if(cleanUsername===user.username){
                throw new apiError(400, "please enter a new username");
            }
            user.username = cleanUsername;
        }
    
        if(email && typeof email==="string" && email.trim()!==""){
            const cleanEmail = email.trim().toLowerCase();
            if(cleanEmail===user.email){
                throw new apiError(400,"please enter a new email");
            }
            user.email=cleanEmail;
        }
        
        //* security reason - we ask to login again because we have changed the credentials of the user in the db
        user.refreshToken = undefined;
        await user.save();
        
        const userResponse = {
            _id:user._id,
            name:user.name,
            username:user.username,
            email:user.email,
            createdAt:user.createdAt,
            updatedAt:user.updatedAt
        }

        const options = {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        };

        return res.status(200)
              .clearCookie("accessToken",options)
              .clearCookie("refreshToken",options)
              .json(new apiResponse(200,userResponse,"account details updated successfully"));     
} catch (error) {

    if (error.code === 11000) {
      
        if (error.keyPattern && error.keyPattern.username) {
            return next(new apiError(409, "This username is already taken"));
        }
        if (error.keyPattern && error.keyPattern.email) {
            return next(new apiError(409, "This email is already in use"));
        }
    }

    next(error);
}
}

export { registerUser, loginUser, logoutUser, refreshAccessToken, getUserProfile,changeCurrentPassword, updateName, checkUniqueUsername,updateUsernameAndEmail};
