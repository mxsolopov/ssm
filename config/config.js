const config = {
  env: process.env.NODE_ENV || "development",
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || "mxsolopov",
  mongoUri:
    process.env.MONGODB_URI ||
    process.env.MONGO_HOST ||
    "mongodb+srv://mxsolopov:z8a-KjZ-Hj3-zJx@solopov-social-network.k7xni6h.mongodb.net/?retryWrites=true&w=majority",
  staticPath: "E:\\Projects\\Frontend\\solopov-social-media\\server\\static"
}

export default config
