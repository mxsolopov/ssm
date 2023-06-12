import express from "express"
import multer from "multer"
import Grid from "gridfs-stream"
import mongoose from "mongoose"
const { ObjectId } = mongoose.Types
import { GridFsStorage } from "multer-gridfs-storage"
import dotenv from "dotenv"
import errorHandler from "./../helpers/dbErrorHandler.js"
import User from "../models/user.model.js"

dotenv.config()
const router = express.Router()

// Создайте подключение к базе данных
const conn = mongoose.createConnection(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

// Инициализируйте GridFSBucket
let gfs

conn.once("open", () => {
  // Инициализация потока GridFSBucket
  gfs = Grid(conn.db, mongoose.mongo)
  gfs.collection("avatars") // Укажите название коллекции, в которую будет сохраняться аватарка
})

// Создайте хранилище multer-gridfs-storage
const storage = new GridFsStorage({
  url: process.env.MONGODB_URI, // URL для подключения к базе данных
  file: (req, file) => {
    return {
      bucketName: "avatars", // Укажите название коллекции, в которую будет сохраняться аватарка
      filename: file.originalname,
    }
  },
})

// Создайте экземпляр multer с использованием хранилища
const upload = multer({ storage })

router.post("/api/avatar", upload.single("avatar"), async (req, res) => {
  try {
    const fileId = req.file.id

    // Обновление пользователя с fileId аватарки
    const userId = req.body.userId // Предположим, что идентификатор пользователя передается в теле запроса
    const user = await User.findByIdAndUpdate(
      userId,
      { avatar: fileId },
      { new: true }
    )

    if (!user) {
      return res.status(404).json({ error: "Пользователь не найден" })
    }
    res.json({ fileId })
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) })
  }
})

router.get("/api/avatar/:id", async (req, res) => {
  const fileId = req.params.id
  try {
    // Проверяем существование файла в GridFSBucket по его ID
    const file = await mongoose.connection.db
      .collection("avatars.files")
      .findOne({ _id: ObjectId(fileId) })

    if (!file) {
      // Файл не найден, возвращаем ошибку или другой результат по вашему усмотрению
      return res.status(404).json({ error: "Файл не найден" })
    }

    // Инициализируем GridFSBucket
    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: "avatars",
    })

    // Создаем поток для чтения файла из GridFSBucket
    const downloadStream = bucket.openDownloadStream(ObjectId(fileId))

    // Устанавливаем заголовки ответа для указания типа контента и размера файла
    res.set("Content-Type", file.contentType)
    res.set("Content-Length", file.length)

    // Отправляем данные файла клиенту
    downloadStream.pipe(res)
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) })
  }
})

// Роут для удаления аватарки (для будущих обновлений)
router.delete("/api/avatar/:id", async (req, res) => {
  const fileId = req.params.id
  try {
    // Проверяем существование файла в GridFSBucket по его ID
    const file = await mongoose.connection.db
      .collection("avatars.files")
      .findOne({ _id: ObjectId(fileId) })

    if (!file) {
      // Файл не найден, возвращаем ошибку или другой результат по вашему усмотрению
      return res.status(404).json({ error: "Файл не найден" })
    }

    // Инициализируем GridFSBucket
    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: "avatars",
    })

    // Удаляем файл из GridFSBucket по его ID
    await bucket.delete(ObjectId(fileId))

    // Удаление fileId из поля avatar в соответствующем пользователе
    const userId = req.body.userId // Предположим, что идентификатор пользователя передается в теле запроса
    await User.findByIdAndUpdate(userId, { avatar: null })

    res.json({ message: "Аватарка успешно удалена" })
  } catch (error) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(error) })
  }
})

export default router
