import notificationController from "../../Controller/notificationController.js";

const notificationResolvers = {
    Query: {
        async getUserNotifications(parent,{ userid }) {     
            return await notificationController.viewUserNotifications(userid);
        },
    },
};

export default notificationResolvers;