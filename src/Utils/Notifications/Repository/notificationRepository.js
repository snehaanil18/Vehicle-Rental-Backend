import pool from "../../../../Config/DB/db.js";

const notificationRepository = {
    //create notification
    async createNotification(userid, message) {
        const query = `
            INSERT INTO notifications (userid, message)
            VALUES ($1, $2) 
            RETURNING *;
        `;
        const values = [userid, message];
        const result = await pool.query(query, values);
        return result.rows[0];
    },

    //view notifications of a particular user
    async getUserNotifications(userid) {        
        const query = `
            SELECT * FROM notifications 
            WHERE userid = $1
            ORDER BY createdat DESC;
        `;
        const values = [userid];
        const result = await pool.query(query, values);

        
        return result.rows;
    }
};

export default notificationRepository;