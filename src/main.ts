import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication, ExpressAdapter } from '@nestjs/platform-express';
import * as session from 'express-session';
import flash = require('connect-flash');
import * as passport from 'passport';
import 'dotenv/config';

import { join } from 'path';
import { Logger, ValidationPipe } from '@nestjs/common';
import helmet = require('helmet');
import { AuthExceptionFilter } from './common/filters/auth-exceptions.filter';
import * as fs from 'fs';
import * as http from 'http';
import * as https from 'https';
import * as express from 'express';

const logger = new Logger('App Main');
// const httpsOptions = {
// 	key: fs.readFileSync(join(__dirname, '..', 'secrets', 'selfsigned.key')),
// 	cert: fs.readFileSync(join(__dirname, '..', 'secrets', 'selfsigned.crt'))
// };
const server = express();
async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule, new ExpressAdapter(server));
	// static file
	app.useStaticAssets(join(__dirname, '..', 'public'));
	app.setBaseViewsDir(join(__dirname, '..', 'views'));

	// chose engine template

	app.setViewEngine('ejs');
	//app.set('view options', { layout: 'main' });

	app.use(helmet());
	app.useGlobalPipes(new ValidationPipe());
	app.useGlobalFilters(new AuthExceptionFilter());
	app.enableCors();

	// Session initialise

	app.use(
		session({
			secret: process.env.SESSION_SECRET,
			resave: false,
			saveUninitialized: false
		})
	);
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(flash());

	await app.init();

	http
		.createServer(server)
		.listen(process.env.APP_PORT, () =>
			logger.verbose(`run server on ${process.env.APP_HOST}:${process.env.APP_PORT}`)
		);
	// Listen app
	/*await app.listen(process.env.APP_PORT, () =>
		logger.verbose(`run server on ${process.env.APP_HOST}:${process.env.APP_PORT}`)
	);*/
}
bootstrap();
