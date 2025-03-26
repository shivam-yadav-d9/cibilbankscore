import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name: {  // Changed from name → fullname
        type: String,
        required: true,
    },
    email: {  // Changed from mobile → email
        type: String,
        required: true,
        unique: true,  // Ensure email is unique
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    }
});

const User = mongoose.model("User", userSchema);

export default User;



