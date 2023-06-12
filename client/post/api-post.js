const create = async (params, credentials, post) => {
  try {
    let response = await fetch("/api/posts/new/" + params.userId, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + credentials.t,
      },
      body: JSON.stringify(post),
    })
    return await response.json()
  } catch (err) {
    console.log(err)
  }
}

const listNewsFeed = async (params, credentials, signal) => {
  try {
    let response = await fetch("/api/posts/feed/" + params.userId, {
      method: "GET",
      signal: signal,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + credentials.t,
      },
    })
    return await response.json()
  } catch (err) {
    console.log(err)
  }
}

const removePost = async (params, credentials) => {
  try {
    let response = await fetch('/api/posts/' + params.postId, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + credentials.t
      }
    })
    return await response.json()
  } catch(err) {
    console.log(err)
  }
}

const removeUserPosts = async (params, credentials) => {
  try {
    let response = await fetch('/api/posts/user/' + params.userId, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + credentials.t
      }
    })
    return await response.json()
  } catch(err) {
    console.log(err)
  }
}

const removeComment = async (params, credentials) => {
  try {
    let response = await fetch('/api/posts/' + params.postId + "/" + params.commentId, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + credentials.t
      }
    })
    return await response.json()
  } catch(err) {
    console.log(err)
  }
}

const comment = async (params, credentials, postId, comment) => {
  try {
    let response = await fetch("/api/posts/comment/", {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + credentials.t,
      },
      body: JSON.stringify({
        userId: params.userId,
        postId: postId,
        comment: comment,
      }),
    })
    return await response.json()
  } catch (err) {
    console.log(err)
  }
}

const like = async (params, credentials, postId) => {
  try {
    let response = await fetch("/api/posts/like/", {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + credentials.t,
      },
      body: JSON.stringify({ userId: params.userId, postId: postId }),
    })
    return await response.json()
  } catch (err) {
    console.log(err)
  }
}

const removelike = async (params, credentials, postId) => {
  try {
    let response = await fetch("/api/posts/removelike/", {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + credentials.t,
      },
      body: JSON.stringify({ userId: params.userId, postId: postId }),
    })
    return await response.json()
  } catch (err) {
    console.log(err)
  }
}

const dislike = async (params, credentials, postId) => {
  try {
    let response = await fetch("/api/posts/dislike/", {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + credentials.t,
      },
      body: JSON.stringify({ userId: params.userId, postId: postId }),
    })
    return await response.json()
  } catch (err) {
    console.log(err)
  }
}

const removedislike = async (params, credentials, postId) => {
  try {
    let response = await fetch("/api/posts/removedislike/", {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + credentials.t,
      },
      body: JSON.stringify({ userId: params.userId, postId: postId }),
    })
    return await response.json()
  } catch (err) {
    console.log(err)
  }
}

export {
  create,
  listNewsFeed,
  comment,
  like,
  removelike,
  dislike,
  removedislike,
  removePost,
  removeUserPosts,
  removeComment
}
