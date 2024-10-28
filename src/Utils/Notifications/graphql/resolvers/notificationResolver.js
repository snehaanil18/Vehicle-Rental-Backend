import notificationController from "../../Controller/notificationController.js";

const notificationResolvers = {
    Query: {
        //view notifications of a particular user
        async getUserNotifications(parent,{ userid }) {     
            return await notificationController.viewUserNotifications(userid);
        },
    },
};

export default notificationResolvers;