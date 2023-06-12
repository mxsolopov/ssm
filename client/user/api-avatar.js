const upload = async (avatar, userId) => {
  try {
    const formData = new FormData()
    formData.append("avatar", avatar)
    formData.append("userId", userId)

    const response = await fetch("/api/avatar", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      throw new Error("Ошибка при загрузке аватарки")
    }

    return await response.json()
  } catch (err) {
    console.error(err)
  }
}

export { upload }
