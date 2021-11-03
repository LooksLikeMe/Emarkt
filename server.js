import dotenv from 'dotenv'
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import fileUpload from 'express-fileupload'
import cookieParser from 'cookie-parser'

//Import routes
import userRouter from './routes/userRouter.js'
import categoryRouter from './routes/categoryRouter.js'
import upload from './routes/upload.js'
import productRouter from './routes/productRouter.js'

//Init
dotenv.config()
const app = express()
//

//Midllewares
app.use(express.json())
app.use(cors())
app.use(cookieParser())
app.use(
  fileUpload({
    useTempFiles: true,
  })
)

//Routes
app.use('/user', userRouter)
app.use('/api', categoryRouter)
app.use('/api', upload)
app.use('/api', productRouter)

//Mongo connection
const URI = process.env.MONGODB_URL
mongoose.connect(URI, {}, (err) =>
  err ? console.log(err) : console.log('Connected to MongoDB')
)
//Start server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
