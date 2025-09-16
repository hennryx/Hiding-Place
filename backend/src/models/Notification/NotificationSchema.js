const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: [true, "Notification message is required"],
      trim: true,
    },
    type: {
      type: String,
      enum: ["EXPIRY", "LOW_STOCK", "SYSTEM", "ERROR"],
      default: "EXPIRY",
      required: true,
    },
    relatedEntity: {
      type: mongoose.Schema.ObjectId,
      refPath: "entityType",
      required: false,
    },
    entityType: {
      type: String,
      enum: ["Product", "ProductBatch", "Transaction", null],
      required: false,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: false,
    },
    recipient: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: false,
    },
    readBy: [
      {
        user: {
          type: mongoose.Schema.ObjectId,
          ref: "User",
        },
        readAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Notification", NotificationSchema);
