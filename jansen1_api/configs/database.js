const Sequelize = require("sequelize");

const db = new Sequelize(
    "db_jsys", 
    "root",
    "",
    {
        host: '127.0.0.1',
        port : '3308',
        dialect: 'mysql',

        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        define: {
            timestamps: false
        }

    }
);



db.authenticate()
    .then(() => {
        console.log(
            'Connection to database has been established successfully.'
        );
    })
    .catch((err) => {
        console.error('Unable to connect to the database:', err);
    });
    

module.exports = db;
