import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    userType: { // ADD THIS FIELD
        type: String,
        enum: ['customer'], // Only customer can signup through here
        default: 'customer'
    }
});

const User = mongoose.model("User", userSchema);

export default User;