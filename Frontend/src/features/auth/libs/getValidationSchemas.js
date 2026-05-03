export default function getValidationSchemas(val) {
    return validationsSchemas[val];
}

const validationsSchemas = {
    email: {
        required: "Email is required",
        pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: "Invalid email address",
        },
    },
    password: {
        required: "Password is required",
        minLength: {
            value: 8,
            message: "Password must be at least 8 characters",
        },
    },
    username: {
        required: "Username is required",
        minLength: {
            value: 3,
            message: "Username must be at least 3 characters",
        },
        maxLength: {
            value: 20,
            message: "Username cannot exceed 20 characters",
        },
        pattern: {
            value: /^[a-zA-Z0-9._]+$/,
            message: "Username can only contain letters, numbers, dots, and underscores",
        },
    },
    name: {
        required: "Name is required",
        minLength: {
            value: 2,
            message: "Name must be at least 2 characters",
        },
        maxLength: {
            value: 50,
            message: "Name cannot exceed 50 characters",
        },
        pattern: {
            value: /^[a-zA-Z\s'-]+$/,
            message: "Name can only contain letters, spaces, apostrophes, and hyphens",
        },
    },
    otp: {
        required: "OTP is required",
        minLength: {
            value: 4,
            message: "OTP must be 4 digits",
        },
        maxLength: {
            value: 4,
            message: "OTP must be 4 digits",
        },
        pattern: {
            value: /^\d{4}$/,
            message: "OTP must contain only digits",
        },
    },
};
