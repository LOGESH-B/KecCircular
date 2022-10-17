const {ONE_SIGNAL_CONFIG}=require("../config/app.config");


const pushNotificationService=require("../services/push_notification.service");

exports.SendNotification=(req,res,next)=>{
    const message={
        app_id:ONE_SIGNAL_CONFIG.APP_ID,
        contents:{en:"Test Notification Push"},
        included_segments:["All"],
        content_available:true,
        small_icon:"ic_notification_icon",
        data:{
            pushTitle:"CUSTOM NOTIFICATION"
        }
    }

     pushNotificationService.SendNotification(message,(error,results)=>{
        if(error){
            return next(error);
        }
        return res.status(200).send({
            message:"Success",
            data: results,
        })
    })
}

exports.SendNotificationToDevice=(req,res,next)=>{
    console.log(req.body)
    const message={
        app_id:ONE_SIGNAL_CONFIG.APP_ID,
        contents:{en:"Test Notification Push"},
        included_segments:["All"],
        filters:[
            {"field":"email","value":"logeshb.20it@kongu.edu"}
        ],
        content_available:true,
        small_icon:"ic_notification_icon",
        data:{
            pushTitle:"CUSTOM NOTIFICATION"
        }
    }

     pushNotificationService.SendNotification(message,(error,results)=>{
        if(error){
            console.log('hii');
            return next(error);
        }
        return res.status(200).send({
            message:"Success",
            data: results,
        })
    })

        


}