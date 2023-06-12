import express from "express"
import authCtrl from "../controllers/auth.controller.js"
import postCtrl from "../controllers/post.controller.js"

const router = express.Router()

router
  .route("/api/posts/new/:userId")
  .post(authCtrl.requireSignin, postCtrl.create)

router
  .route("/api/posts/feed/:userId")
  .get(authCtrl.requireSignin, postCtrl.listNewsFeed)

router
  .route("/api/posts/:postId")
  .delete(authCtrl.requireSignin, postCtrl.removePost)

router
  .route("/api/posts/user/:userId")
  .delete(authCtrl.requireSignin, postCtrl.removeUserPosts)

router
  .route("/api/posts/:postId/:commentId")
  .delete(authCtrl.requireSignin, postCtrl.removeComment)

router.route("/api/posts/comment").put(authCtrl.requireSignin, postCtrl.comment)

router.route("/api/posts/like").put(authCtrl.requireSignin, postCtrl.like)
router
  .route("/api/posts/removelike")
  .put(authCtrl.requireSignin, postCtrl.removelike)

router.route("/api/posts/dislike").put(authCtrl.requireSignin, postCtrl.dislike)
router
  .route("/api/posts/removedislike")
  .put(authCtrl.requireSignin, postCtrl.removedislike)

export default router
