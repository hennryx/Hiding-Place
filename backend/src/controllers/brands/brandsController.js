const BrandSchema = require("../../models/Brands/BrandSchema");

exports.createBrand = async(req, res) => {
    try {
        const data = req.body

        if(!data.brandName) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields"
            });
        }

        const newBrand = await BrandSchema.create({
            data,
            image: req.image
        })

        res.status(500).json({
            success: true,
            data: newBrand,
            message: "New brand added"
        })

    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            success: false,
            message: 'Something went wrong'
        })
    }
}