import mongoose from "mongoose"
const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: "Title is required",
  },
  text: {
    type: String,
    required: "Text is required",
  },
  likes: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
  dislikes: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
  comments: [
    {
      _id: { type: String },
      text: {
        type: String,
      },
      created: { type: Date, default: Date.now },
      postedBy: { type: mongoose.Schema.ObjectId, ref: "User" },
    },
  ],
  postedBy: { type: mongoose.Schema.ObjectId, ref: "User" },
  created: {
    type: Date,
    default: Date.now,
  },
})

export default mongoose.model("Post", PostSchema)
