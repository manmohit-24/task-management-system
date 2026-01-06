import { apiError } from "../utils/apiError.js";

//* next(param)
export const globalErrorHandler = (err, req, res, next) => {

    if (err instanceof apiError) {
        return res.status(err.statuscode).json({
            success: false,
            message: err.message,
            errors: err.errors || []
        });
    }
    
    // Handle MongoDB CastError (invalid ObjectId)
    if (err.name === 'CastError') {
        return res.status(400).json({
            success: false,
            message: "Invalid ID format",
            errors: []
        });
    }

    //if unhandled error then -  
    console.error("UNHANDLED ERROR:", err.stack); // Log the real error
    return res.status(500).json({
        success: false,
        message: "Internal Server Error",
        errors: []
    });
};