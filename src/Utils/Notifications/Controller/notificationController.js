import notificationRepository from "../Repository/notificationRepository.js";

const notificationController = {
    async createNotification(userid,message){
        const newNotification = await notificationRepository.createNotification(userid, message);
        return newNotification;
    },

    async viewUserNotifications(userId){
        const result = await notificationRepository.getUserNotifications(userId);
        return result;
    }
}

export default notificationController;