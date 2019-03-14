module.exports = {
    getAllTheatre: `SELECT 
        the.id,
        the.name,
        the.address,
        the.phone,
        the.email,
        the.site_url,
        the.history,
        the.country,
        the.province,
        the.profile_image,
        the.cover_image,
        the.city,
        the.circuit_type,
        theimg.id AS img_id,
        theimg.src,
        theimg.alt,
        theroom.id AS room_id,
        theroom.name AS room_name,
        theroom.capacity,
        theroom.black_camera,
        theroom.relevant_data,
        theroom.profile_image,
        theroom.scenic_space,
        theroom.escenary_type
    FROM 
        theatre AS the
    LEFT JOIN
        theatre_image AS theimg ON the.id = theimg.theatre_id
    LEFT JOIN
        theatre_room as theroom ON the.id = theroom.theatre_id;`,
    
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

    getNotificationsByUserId: `SELECT
        pay.id,
        pay.code,
        pay.theatre_id,
        pay.show_id,
        pay.date,
        pay.amount,
        pay.action_id,
        pay.status,
        payact.name
    FROM 
        payment AS pay
    LEFT JOIN
        payment_action AS payact ON pay.action_id = payact.id
    WHERE
        pay.user_id = ?;`,

    getTheatreById: `SELECT 
        the.id,
        the.name,
        the.address,
        the.phone,
        the.email,
        the.site_url,
        the.history,
        the.country,
        the.province,
        the.profile_image,
        the.cover_image,
        the.city,
        the.circuit_type,
        theimg.id AS img_id,
        theimg.src,
        theimg.alt,
        theroom.id AS room_id,
        theroom.name AS room_name,
        theroom.capacity,
        theroom.black_camera,
        theroom.relevant_data,
        theroom.profile_image,
        theroom.scenic_space,
        theroom.escenary_type
    FROM 
        theatre AS the
    LEFT JOIN
        theatre_image AS theimg ON the.id = theimg.theatre_id
    LEFT JOIN
        theatre_room as theroom ON the.id = theroom.theatre_id
    WHERE
        the.id = ?;`,
    
    getTheatreRoomById: `SELECT 
        theroom.id,
        theroom.name,
        theroom.capacity,
        theroom.black_camera,
        theroom.relevant_data,
        theroom.profile_image,
        theroom.scenic_space,
        theroom.escenary_type,
        the.id AS theatre_id,
        the.name AS theatre_name,
        the.address,
        the.phone,
        the.email,
        the.site_url,
        the.history,
        the.country,
        the.province,
        the.profile_image,
        the.cover_image,
        the.city,
        the.circuit_type,
        theimg.id AS img_id,
        theimg.src,
        theimg.alt
    FROM 
        theatre_room AS theroom
    LEFT JOIN
        theatre as theroom ON the.theatre_id = theroom.theatre_id
    LEFT JOIN
        theatre_image AS theimg ON the.theatre_id = theimg.theatre_id
    WHERE
        theroom.id = ?;`,
    
    getUserByEmail: `SELECT 
        id,
        fullname,
        phone,
        type,
        responsability
    FROM 
        user
    WHERE
        email = ?;`,

    getUserByEmailPassword: `SELECT 
        id,
        fullname,
        phone,
        type,
        responsability
    FROM 
        user
    WHERE
        email = ? AND password = ?;`,

    updateNotification: `UPDATE notification SET ? WHERE user_id = ? AND id = ?;`,

    updateUser: `UPDATE user SET ? WHERE id = ?;`,
};