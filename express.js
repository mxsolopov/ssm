import express from "express"
import bodyParser from "body-parser"
import cookieParser from "cookie-parser"
import compress from "compression"
import cors from "cors"
import helmet from "helmet"

import userRoutes from "./routes/user.routes.js"
import authRoutes from "./routes/auth.routes.js"
import postRoutes from "./routes/post.routes.js"
import avatarRoutes from "./routes/avatar.routes.js"

const app = express()

const jsonParser = bodyParser.json()

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true, parameterLimit: 50000}));
app.use(cookieParser())
app.use(compress())
app.use(helmet())
app.use(cors())

app.use("/", jsonParser, userRoutes)
app.use("/", jsonParser, authRoutes)
app.use("/", jsonParser, postRoutes)
app.use("/", jsonParser, avatarRoutes)


app.use((err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    res.status(401).json({ error: err.name + ": " + err.message })
  } else if (err) {
    res.status(400).json({ error: err.name + ": " + err.message })
    console.log(err)
  }
})

export default app
