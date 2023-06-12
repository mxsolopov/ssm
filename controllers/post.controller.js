import Post from "../models/post.model.js"
import User from "../models/user.model.js"
import errorHandler from "./../helpers/dbErrorHandler.js"

const create = async (req, res) => {
  const post = new Post(req.body)
  try {
    await post.save()
    return res.status(200).json(post)
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) })
  }
}

const listNewsFeed = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .select("following")
      .exec()
    const following = user.following
    following.push(req.params.userId)
    let posts = await Post.find({ postedBy: { $in: following } })
      .populate("comments.postedBy", "_id name avatar")
      .populate("postedBy", "_id name avatar")
      .sort("-created")
      .exec()
    res.status(200).json(posts)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    })
  }
}

const comment = async (req, res) => {
  try {
    const postId = req.body.postId
    const comment = req.body.comment

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $push: { comments: comment } },
      { new: true }
    )

    if (!updatedPost) {
      return res.status(404).json({ error: "Post not found" })
    }

    res.status(200).json(updatedPost)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    })
  }
}

const removePost = async (req, res) => {
  try {
    const postId = req.params.postId
    await Post.deleteOne({ _id: postId })
    res.status(200).json("Post deleted")
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    })
  }
}

const removeUserPosts = async (req, res) => {
  try {
    const userId = req.params.userId
    await Post.deleteMany({ postedBy: userId })
    res.status(200).json("Posts deleted")
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    })
  }
}

const removeComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params

    console.log(postId, commentId)

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $pull: { comments: { _id: commentId } } },
      { new: true }
    )

    if (!updatedPost) {
      return res.status(404).json({ error: "Post not found" })
    }

    res.status(200).json({ message: "Comment deleted" })
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) })
  }
}

const like = async (req, res) => {
  try {
    let result = await Post.findByIdAndUpdate(
      req.body.postId,
      { $push: { likes: req.body.userId } },
      { new: true }
    )
    res.json(result)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    })
  }
}

const removelike = async (req, res) => {
  try {
    let result = await Post.findByIdAndUpdate(
      req.body.postId,
      { $pull: { likes: req.body.userId } },
      { new: true }
    )
    res.json(result)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    })
  }
}

const dislike = async (req, res) => {
  try {
    let result = await Post.findByIdAndUpdate(
      req.body.postId,
      { $push: { dislikes: req.body.userId } },
      { new: true }
    )
    res.json(result)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    })
  }
}

const removedislike = async (req, res) => {
  try {
    let result = await Post.findByIdAndUpdate(
      req.body.postId,
      { $pull: { dislikes: req.body.userId } },
      { new: true }
    )
    res.json(result)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    })
  }
}

export default {
  create,
  listNewsFeed,
  comment,
  like,
  removelike,
  dislike,
  removedislike,
  removePost,
  removeComment,
  removeUserPosts,
}
