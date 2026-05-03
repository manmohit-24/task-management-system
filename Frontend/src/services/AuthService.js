function handleError(error) {
    let message = "";
    if (error.code === 401 || error.code === 400) {
        message = "Plaease check your email or password";
    } else if (error.code === 403) {
        message = "Access denied";
    } else if (error.code === 404) {
        message = "Account not found";
    } else if (error.code === 409) {
        message = "User with current email already exists";
    } else if (error.code === 429) {
        message = "Too many requests, try again later";
    } else {
        message = "An unknown error occurred"; // Default message for unknown codes
    }

    return message;
}

export class Auth {
    API_URL;
    constructor() {
        this.API_URL = ""; // Will replace with process.env.______
    }

    // Response Format :
    //  res = [message, successStatus , data]

    async checkEmailAvailability(email) {
        let res = ["Failed to make request", false];
        // Check if there is an account with email
        // if yes return false
        //else true
        res = ["Email is available", true];
        return res;
    }

    async checkActiveSession() {
        let res = ["Failed to make request", false];
        //check in coockies for active session
        res = ["Session is active", true];
        return res;
    }

    googleLogin() {
        try {
            // Google Login
            return ["SuccessFully Logged In with google", true , {email:"email",name:"name"}];
        } catch (error) {
            console.log("Google login error:", error);
            return [handleError(error), false]; // Handle error if any
        }
    }

    async login({ email, password }) {
        let res = ["Failed to make request", false, {}];

        // Login user with email and password
        // Create a session for the user
        res = ["SuccessFully Logged In", true, { name: "John Doe" }];
        return res;
    }

    async logout() {
        let res = ["Failed to make request", false];
        // delete session
        // delete tookens
        res = ["SuccessFully Logged Out", true];
        return res;
    }

    async register({ email, password }) {
        let res = ["Failed to make request", false];

        // Register with email and password.
        // Send Verification Email
        // Then Loggin the user
        res = ["SuccessFully Registered", true];
        return res;
    }

    async resetPassword(email) {
        let res = ["Failed to make request", false];
        // send reset password link to email
        res = ["SuccessFully sent reset password link", true];
        return res;
    }

    async verifyEmail(email) {
        let res = ["Failed to make request", false];
        // send verification link to email
        res = ["SuccessFully sent verification link", true];
        return res;
    }
}

const authService = new Auth();
export default authService;
