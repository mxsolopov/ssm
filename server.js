import path from "path"
import express from "express"
import mongoose from "mongoose"

import app from "./express.js"
import { fileURLToPath } from "url"
import { dirname } from "path"
import dotenv from "dotenv"

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

mongoose.Promise = global.Promise
mongoose.set("strictQuery", false)
mongoose.connect(process.env.MONGODB_URI, {})
mongoose.connection.on("connected", () => {
  console.log("Successfully connected to the database")
})
mongoose.connection.on("error", () => {
  throw new Error(`unable to connect to database: ${process.env.MONGODB_URI}`)
})

app.get("*.js", (req, res, next) => {
  // Set the MIME type for JavaScript files
  console.log("Javascript")
  res.set("Content-Type", "application/javascript")
  next()
})

if (process.env.NODE_ENV === "production") {
  app.use("/", express.static(path.join(__dirname, "dist")))

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "dist", "index.html"))
  })
}

const PORT = process.env.PORT || 5000

app.listen(PORT, (err) => {
  if (err) {
    console.log(err)
  }
  console.info("Server started on port %s.", PORT)
})
