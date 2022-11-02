
const express=require('express')
const router = express.Router();
const {isLoggedIn}=require("../middleware/auth")
const pushNotificationController=require("../controllers/push_notification.controllers")


router.get('/sendnotification',isLoggedIn,pushNotificationController.SendNotification)
router.post('/sendnotificationToDevice',isLoggedIn,pushNotificationController.SendNotificationToDevice)


module.exports=router;