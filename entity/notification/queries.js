module.exports = {
    getNotificationByUserId: `SELECT 
        id,
        type,
        text,
        \`read\`,
        date
    FROM 
        notification
    WHERE
        user_id = ?;`,
    
    updateNotification: `UPDATE notification SET ? 
        WHERE user_id = ? AND id = ?;`,
};