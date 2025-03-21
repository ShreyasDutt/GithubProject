import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            minlength: 3,
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        },
        dp: {
            type: String,
            default: "https://i.pinimg.com/736x/27/21/91/272191f4b52ae4b2e7a9019c2a2027c9.jpg",
        },
        fullname: {
            type: String,
            required: true,
            trim: true,
        },
        posts: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Post",
            },
        ],
        pins:[
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Post",
            }
        ],
        Boards:[{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Board",
        }]
    },
    { timestamps: true }
);

export default mongoose.model("User", UserSchema);

