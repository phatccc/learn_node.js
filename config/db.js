const mongoose = require('mongoose');

const connectDB = async () => {
    const uri = process.env.ATLAS_URI ;
    console.log("Mongodb Connected")
    try {
        await mongoose.connect(uri)
        console.log("Mongodb Connected")
    } catch (error) {
        console.error("Mongodb Connection Error:" , error.message)
        process.exit(1)
    }
}

module.exports = connectDB;