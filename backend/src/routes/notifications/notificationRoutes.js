const express = require('express');
const { protect } = require('../../middlewares/auth');
const { getAllNotifications, markAsRead, deleteNotification, archivedNotif } = require('../../controllers/notifications/notificationController');
const router = express.Router()

router.get('/getAll', protect, getAllNotifications)
router.put('/markAsRead', protect, markAsRead)
router.put('/archive', protect, archivedNotif)
router.delete('/delete', protect, deleteNotification)

module.exports = router;