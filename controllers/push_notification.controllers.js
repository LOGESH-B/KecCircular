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
        included_segments:["included_player_ids"],
        include_player_ids:req.body.devices,
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

exports.pushnotify=(devices,content,title)=>{
    console.log(devices)
    const message={
        app_id:ONE_SIGNAL_CONFIG.APP_ID,
        contents:{en:content},
        included_segments:["included_player_ids"],
        include_player_ids:devices,
        content_available:true,
        small_icon:"ic_stat_onesignal_default",
        data:{
            pushTitle:title,
        }
    }

     pushNotificationService.SendNotification(message,(error,results)=>{
        if(error){
            return {
                message:"Success",
                error: error,
            };
        }
        return {
            message:"Success",
            data: results,
        }
    })

        
}