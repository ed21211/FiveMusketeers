import express, { json, Request, Response } from 'express';
import {setData} from './dataStore'
import {createOrder} from './app';

import morgan from 'morgan';
import cors from 'cors';
import errorHandler from 'middleware-http-errors';
import YAML from 'yaml';
import sui from 'swagger-ui-express';
import fs from 'fs';
import config from './config.json' assert { type: 'json' };
import path from 'path';
import process from 'process';
import HTTPError from 'http-errors';


// Set up web app
const app = express();
// Use middleware that allows us to access the JSON body of requests
app.use(json());
// Use middleware that allows for access from other domains
app.use(cors());
// for logging errors (print to terminal)
app.use(morgan('dev'));
// for producing the docs that define the API
const file = fs.readFileSync(path.join(process.cwd(), 'swagger.yaml'), 'utf8');
app.get('/', (req: Request, res: Response) => res.redirect('/docs'));
app.use('/docs', sui.serve, sui.setup(YAML.parse(file), { swaggerOptions: { docExpansion: config.expandDocs ? 'full' : 'list' } }));

const PORT: number = parseInt(process.env.PORT || config.port);
const HOST: string = process.env.IP || '127.0.0.1';

// For persistence -> stores data in ./database.json
const load = () => {
	if (fs.existsSync('./database.json')) {
	  const file = fs.readFileSync('./database.json', { encoding: 'utf8' });
	  setData(JSON.parse(file));
	}
  };
  load();
////////////////////////////////////////////////////////////////////////////////
app.post('/buyer/createOrder', (req: Request, res: Response) => {
	const { email, ordersList, deliveryAddressProvided } = req.body;
	const result = createOrder( email, ordersList, deliveryAddressProvided);
  
	if ('error' in result) {
	  throw HTTPError(result.code, result.error);
	}
  
	res.json(result);
});
  
////////////////////////////////////////////////////////////////////////////////
app.use((req: Request, res: Response) => {
	const error = `
	  Route not found - This could be because:
		0. You have defined routes below (not above) this middleware in server.ts
		1. You have not implemented the route ${req.method} ${req.path}
		2. There is a typo in either your test or server, e.g. /posts/list in one
		   and, incorrectly, /post/list in the other
		3. You are using ts-node (instead of ts-node-dev) to start your server and
		   have forgotten to manually restart to load the new changes
		4. You've forgotten a leading slash (/), e.g. you have posts/list instead
		   of /posts/list in your server.ts or test file
	`;
	res.json({ error });
});
  
// For handling errors
app.use(errorHandler());
  
// start server
const server = app.listen(PORT, HOST, () => {
// DO NOT CHANGE THIS LINE
	console.log(`⚡️ Server started on port ${PORT} at ${HOST}`);
});
  
// For coverage, handle Ctrl+C gracefully
process.on('SIGINT', () => {
	server.close(() => console.log('Shutting down server gracefully.'));
});
