const mongoose = require('mongoose')

const BrandsSchema = new mongoose.Schema({
    brandName: {
        type: String,
        required: true
    },
    image: {
        name: String,
        url: String,
        cloudinary_id: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
},{
    timestamps: true
})

module.exports = mongoose.model('Brands', BrandsSchema)