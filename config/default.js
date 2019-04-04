module.exports = {
    port: 3000,
    mysql: {
        host: process.env.CHALLENGE_MYSQL_HOST || 'xxxxx',
        user: process.env.CHALLENGE_MYSQL_USER || 'xxxxx',
        password: process.env.CHALLENGE_MYSQL_PASS || 'xxxxx',
        database: process.env.CHALLENGE_MYSQL_DB || 'xxxxx',
        connectionLimit: process.env.CHALLENGE_MYSQL_CONNLIMIT || 10
    },
    redis: {
        host: process.env.CHALLENGE_REDIS_HOST || 'xxxxx',
        port: process.env.CHALLENGE_REDIS_PORT || 'xxxxx'
    },
    nodemailer: {
        service: process.env.CHALLENGE_MAIL_SERVICE || 'xxxxx',
        auth: {
            user: process.env.CHALLENGE_MAIL_USER || 'xxxxx',
            pass: process.env.CHALLENGE_MAIL_PASS || 'xxxxx'
        }
    },
    tokenTime: process.env.CHALLENGE_TOKEN_TIME || 3000,
    resetTime: process.env.CHALLENGE_RESET_TIME || 3000
};