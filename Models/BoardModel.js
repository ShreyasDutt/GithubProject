import mongoose from "mongoose";

const BoardModel = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    title:{
        type: String,
        default: "Board",
    },
    post: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
})

export default mongoose.model("Board", BoardModel);


