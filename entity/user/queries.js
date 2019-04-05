module.exports = {
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
    
    insertTheatre: `INSERT INTO 
        theatre SET ?`,
    
    insertUser: `INSERT INTO 
        user SET ?`,
    
    updateUser: `UPDATE user SET ? 
        WHERE id = ?;`,
};