require('dotenv').config();
const express = require('express');
const sequelize = require('./db.js');
const models = require('./models/models');
const chalk = require('chalk');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const router = require('./routes');
const errorHandler = require('./middleware/ErrorHandlerMiddleware');
const path = require('path');

const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'static')));
app.use(
	fileUpload({
		limits: { fileSize: 50 * 1024 * 1024 },
		preserveExtension: true,
	})
);
app.use('/api', router);
// app.use('/api', (err, req, res) => {
// 	console.log(err, 'next usercontroller running');
// });

// Обработка ошибок замыкает работу роутинга
app.use(errorHandler);

const start_db = async () => {
	try {
		await sequelize.authenticate();
		await sequelize.sync();

		if (process.env.NODE_ENV === 'production') {
			console.log(chalk.red('This is production mode'));
			app.use('/', express.static(path.join(__dirname, 'client')));

			const indexPath = path.join(__dirname, 'client', 'index.html');
			app.get('*', (req, res) => {
				res.sendFile(indexPath);
			});
		} else {
			console.log(chalk.blue('This is development mode'));
		}

		app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
		console.log('Подключение к БД успешно завершено');
	} catch (e) {
		console.log(`Произошла ошибка при старте БД ${e.message}`);
		process.exit(1);
	}
};

start_db();
