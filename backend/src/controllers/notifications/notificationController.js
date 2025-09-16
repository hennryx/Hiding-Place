const { default: mongoose } = require("mongoose");
const NotificationSchema = require("../../models/Notification/NotificationSchema")

exports.getAllNotifications = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const _id = req.query._id

        const allNotifications = await NotificationSchema.find({recipient: _id})
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 })
            .lean();

        res.status(200).json({
            data: allNotifications,
            success: true
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            success: false,
            mesage: 'Something went wrong'
        })
    }
}

exports.markAsRead = async (req, res) => {
    try {
        const { _id, readBy } = req.body

        if (!_id) {
            return res.status(400).json({
                success: false,
                message: "Missing notification ID"
            });
        }

        const readNotif = await NotificationSchema.findByIdAndUpdate(_id, { isRead: true, readBy: new mongoose.Types.ObjectId(readBy) }, { new: true })

        if (!readNotif) {
            return res.status(404).json({
                success: false,
                message: "Notification not found"
            });
        }

        res.status(200).json({
            data: readNotif,
            success: true
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            success: false,
            mesage: 'Something went wrong'
        })
    }
}

exports.archivedNotif = async (req, res) => {
    try {
        const { _id, readBy, isArchived } = req.body

        if (!_id) {
            return res.status(400).json({
                success: false,
                message: "Missing notification ID"
            });
        }

        const readNotif = await NotificationSchema.findByIdAndUpdate(_id, { isArchived, readBy: new mongoose.Types.ObjectId(readBy) }, { new: true })

        if (!readNotif) {
            return res.status(404).json({
                success: false,
                message: "Notification not found"
            });
        }

        res.status(200).json({
            data: readNotif,
            success: true
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            success: false,
            mesage: 'Something went wrong'
        })
    }
}

exports.deleteNotification = async (req, res) => {
    try {
        const { _id } = req.body;
        if (!_id) {
            res.status(200).json({
                success: false,
                message: "Missing id"
            })
        }
        const deletedData = await NotificationSchema.findByIdAndDelete(_id);

        if (!deletedData) {
            return res.status(404).json({
                success: false,
                message: "Notification not found"
            });
        }

        res.status(200).json({
            success: true,
            data: deletedData,
            message: "Successfully Deleted Notification"
        })

    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            success: false,
            mesage: 'Something went wrong'
        })
    }
}