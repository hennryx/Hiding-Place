const mongoose = require("mongoose");
const QRCode = require("qrcode");
const Notifications = require("../Notification/NotificationSchema");
const Users = require("../Users");
const ProductBatch = require("./batchSchema");

const ProductSchema = new mongoose.Schema(
    {
        productName: {
            type: String,
            required: [true, "Please add a product name"],
            trim: true,
            maxlength: [100, "Product name cannot exceed 100 characters"],
        },
        containerType: {
            type: String,
            enum: ["bottle", "pcs", "packs"],
        },
        sellingPrice: {
            type: Number,
            required: [true, "Selling price is required"],
            min: [0, "Price must be positive"],
        },
        image: {
            name: String,
            url: String,
            cloudinary_id: String,
        },
        createdBy: {
            type: mongoose.Schema.ObjectId,
            ref: "User",
            required: true,
        },
        updatedBy: {
            type: mongoose.Schema.ObjectId,
            ref: "User",
        },
        category: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ["active", "inactive"],
            default: "active",
        },
        description: {
            type: String,
        },
        brand: {
            type: String,
        },
        qrCode: {
            type: String,
            unique: true,
        },
        qrCodeData: {
            type: String,
        },
        totalStock: {
            type: Number,
            default: 0,
            min: [0, "Out of stock"],
        },
        lastLowStockNotifiedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

ProductSchema.pre("save", async function (next) {
    if (this.isNew && !this.qrCode) {
        try {
            const qrCodeContent = this._id.toString();
            const qrCodeDataUrl = await QRCode.toDataURL(qrCodeContent, {
                errorCorrectionLevel: "H",
                type: "image/png",
                margin: 1,
            });

            this.qrCode = qrCodeContent;
            this.qrCodeData = qrCodeDataUrl;

            next();
        } catch (error) {
            next(new Error(`Failed to generate QR code: ${error.message}`));
        }
    } else {
        next();
    }
});

// Update totalStock after batch changes and check for low/out of stock
ProductSchema.statics.updateTotalStock = async function (productId) {
    const batches = await ProductBatch.find({ product: productId });
    const totalStock = batches.reduce(
        (sum, batch) => sum + batch.remainingStock,
        0
    );
    const product = await this.findById(productId);

    if (product) {
        const previousStock = product.totalStock;
        product.totalStock = totalStock;
        await product.save({ validateBeforeSave: false });

        // Determine if notification needed
        let shouldNotify = false;
        let message = "";

        if (totalStock === 0 && previousStock > 0) {
            shouldNotify = true;
            message = `Product ${product.productName} is out of stock`;
        } else if (totalStock <= 10 && totalStock > 0 && previousStock > 10) {
            shouldNotify = true;
            message = `Product ${product.productName} has low stock: ${totalStock} units remaining`;
        }

        if (shouldNotify) {
            // Check 24-hour cooldown
            const twentyFourHoursAgo = new Date(
                Date.now() - 24 * 60 * 60 * 1000
            );
            if (
                product.lastLowStockNotifiedAt &&
                product.lastLowStockNotifiedAt > twentyFourHoursAgo
            ) {
                console.log(
                    `Skipping notification for ${product.productName} - recently notified`
                );
                return;
            }

            // Fallback: Query notifications if needed
            const recentNotif = await Notifications.findOne({
                type: "LOW_STOCK",
                relatedEntity: productId,
                createdAt: { $gt: twentyFourHoursAgo },
            });
            if (recentNotif) return;

            // Create notifications
            const usersToNotify = await Users.find({
                role: { $in: ["ADMIN", "STAFF"] },
            });
            const notifications = usersToNotify.map((user) => ({
                message,
                type: "LOW_STOCK",
                relatedEntity: productId,
                entityType: "Product",
                recipient: user._id,
            }));

            const inserted = await Notifications.insertMany(notifications);

            // Update last notified
            product.lastLowStockNotifiedAt = new Date();
            await product.save({ validateBeforeSave: false });

            // Emit real-time via Socket.io
            const io = mongoose.connection.app.get("io"); // Access io
            inserted.forEach((notif) => {
                io.to(notif.recipient.toString()).emit(
                    "newNotification",
                    notif
                );
            });
        }
    }
};

module.exports = mongoose.model("Product", ProductSchema);
