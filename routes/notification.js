
const express=require('express')
const router = express.Router();

const pushNotificationController=require("./controllers/push_notification.controllers")


router.get('/sendnotification',pushNotificationController.SendNotification)
router.post('/sendnotificationToDevice',pushNotificationController.SendNotificationToDevice)


module.exports=router;