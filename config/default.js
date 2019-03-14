module.exports = {
    port: 3000,
    mysql: {
        host: 'xxxxx',
        user: 'xxxxx',
        password: 'xxxxx',
        database: 'xxxxx',
        connectionLimit: 10
    },
    redis: {
        host: 'xxxxx',
        port: 'xxxxx'
    },
    nodemailer: {
        service: 'xxxxx',
        auth: {
            user: 'xxxxx',
            pass: 'xxxxx'
        }
    },
    tokenTime: 3000,
    resetTime: 3000
};