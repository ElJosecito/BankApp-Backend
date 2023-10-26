require('dotenv').config();


const config = {
    appConfig : {
        port: 8080 || process.env.PORT,
        host: 'http://localhost'
    },
    dbConfig : {
        host: 'localhost',
        port: 27017,
        name: 'BankDB'
    },
    env: {
        AccessToken: process.env.ACCESS_TOKEN_SECRET
    }
}

module.exports = config;