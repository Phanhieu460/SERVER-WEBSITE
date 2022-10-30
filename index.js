require('dotenv').config()
const express = require('express')
const mongoose = require("mongoose")
const cors = require("cors")

const authRouter = require('./routes/auth')
const productRouter = require('./routes/product')
const adminRouter = require('./routes/admin')
const customerRouter = require("./routes/customer")
const blogRouter = require("./routes/blog")

const connectDB = async () => {
    try {
        await mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@whey-protein.8blrndp.mongodb.net/?retryWrites=true&w=majority`,{
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log("Connect DataBase")
    } catch (error) {
        console.log(error.message)
        process.exit(1)
    }
}
 
connectDB()

const app = express()
app.use(express.json()) // doc bat cu du lieu trong body
app.use(cors())

app.use('/api/auth', authRouter)
app.use('/products', productRouter )
app.use('/api/admin', adminRouter)
app.use('/customer', customerRouter)
app.use('/blog', blogRouter)


const PORT = process.env.PORT || 4000

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))

  