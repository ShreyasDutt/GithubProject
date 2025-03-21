import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        default:"",
        trim: true,
    },
    image: {
        type: String,
        required: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }
    ],
    comments: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
    }]
}, { timestamps: true });

export default mongoose.model("Post", PostSchema);
