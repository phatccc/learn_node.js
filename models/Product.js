const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            require: true,
            trim: true,
        },
        price: {
            type: Number,
            require: true,
            min: 0,
        },
        description: {
            type: String,
            require: true,
            default: "No description"
        },
        stock: {
            type: Number,
            require: true,
            min: 0,
        },
        createBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            require: true,
        },
    }, { Timestamp: true }
);

module.exports = mongoose.model('Product', productSchema)