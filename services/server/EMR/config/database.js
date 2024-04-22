const mongoose = require('mongoose');  // for database connection and schemas

const dbConnection = () => {
    console.log(process.env.DB_URI)
    mongoose.connect(process.env.DB_URI)
        .then((conn) => {
            console.log(`Database Connected: ${conn.connection.host}`);
        })
};

module.exports = dbConnection;