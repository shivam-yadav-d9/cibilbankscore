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
    userType: {
        type: String,
        enum: ['customer'],
        default: 'customer'
    }
}, {
    timestamps: true // Add this to automatically include createdAt and updatedAt
});

const User = mongoose.model("User", userSchema);

export default User;
