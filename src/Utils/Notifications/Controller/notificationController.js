import notificationRepository from "../Repository/notificationRepository.js";

const notificationController = {
    //create notification following a particular event
    async createNotification(userid,message){
        const newNotification = await notificationRepository.createNotification(userid, message);
        return newNotification;
    },

    //view notifications of a particular user
    async viewUserNotifications(userId){
        const result = await notificationRepository.getUserNotifications(userId);
        return result;
    }
}

export default notificationController;