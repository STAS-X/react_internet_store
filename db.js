const {Sequelize} = require('sequelize');

module.exports = new Sequelize(
	process.env.DB_NAME, // Наименование экземпляра БД
	process.env.DB_USER, // Логин
	process.env.DB_PASSWORD, // Пароль
    {
        dialect: 'postgres',
        host: process.env.DB_HOST,
        port: process.env.DB_PORT
    }
);