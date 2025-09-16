const mongoose = require("mongoose");
const NotificationSchema = require("../Notification/NotificationSchema");
const Users = require("../Users");

const ProductBatchSchema = new mongoose.Schema(
  {
    batchNumber: {
      type: String,
      required: true,
      unique: true,
    },
    supplier: {
      type: mongoose.Schema.ObjectId,
      ref: "Supplier",
      required: true,
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: true,
    },
    stock: {
      type: Number,
      required: true,
      min: [0, "Stock cannot be negative"],
    },
    remainingStock: {
      type: Number,
      required: true,
      min: [0, "Remaining stock cannot be negative"],
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    purchasePrice: {
      type: Number,
      required: true,
      min: [0, "Price must be positive"],
    },
    purchaseDate: {
      type: Date,
      default: Date.now,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    condition: {
      type: String,
      enum: ["good", "expired"],
      default: "good",
    },
  },
  {
    timestamps: true,
  }
);

// Generate unique batch number
ProductBatchSchema.pre("save", async function (next) {
  if (this.isNew && !this.batchNumber) {
    this.batchNumber = `BATCH-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;
  }
  next();
});

// Update Product.totalStock after save
ProductBatchSchema.post("save", async function () {
  const Product = mongoose.model("Product"); // Access model dynamically
  await Product.updateTotalStock(this.product);
});

// Update Product.totalStock after removal
ProductBatchSchema.post("remove", async function () {
  const Product = mongoose.model("Product"); // Access model dynamically
  await Product.updateTotalStock(this.product);
});

// Static method to check and update expired batches
ProductBatchSchema.statics.checkExpiredBatches = async function () {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const expiredBatches = await this.find({
    condition: "good",
    expiryDate: { $lte: today },
  }).populate("product", "productName");

  for (const batch of expiredBatches) {
    batch.condition = "expired";
    batch.status = "inactive";
    await batch.save();

    // Check 24-hour cooldown (rare for expiry, but add for consistency)
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentNotif = await NotificationSchema.findOne({
      type: "EXPIRY",
      relatedEntity: batch._id,
      createdAt: { $gt: twentyFourHoursAgo },
    });
    if (recentNotif) continue;

    const usersToNotify = await Users.find({
      role: { $in: ["admin", "staff"] },
    });

    const notifications = usersToNotify.map((user) => ({
      message: `Batch ${batch.batchNumber} of product ${batch.product.productName} has expired`,
      type: "EXPIRY",
      relatedEntity: batch._id,
      entityType: "ProductBatch",
      recipient: user._id,
    }));

    const inserted = await NotificationSchema.insertMany(notifications);

    // Emit real-time
    const io = mongoose.connection.app.get("io");
    inserted.forEach((notif) => {
      io.to(notif.recipient.toString()).emit("newNotification", notif);
    });
  }
};

module.exports = mongoose.model("ProductBatch", ProductBatchSchema);
