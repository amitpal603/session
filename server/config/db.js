const mongoose = require('mongoose')
require('dotenv').config()
const connectDB = async() => {
 try {
    mongoose.connect(process.env.MONGODB_URI)
    console.log('connected successfully')
 } catch (error) {
    console.log('server database connection field',error.message)
 }
}

module.exports = connectDB