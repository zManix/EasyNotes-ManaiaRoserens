import express, { Application } from 'express';
import dotenv from 'dotenv';
import path from 'path';

import pageRoutes from './routes/pages';

import { db } from './lib/db';
import os from 'os';

//For env File
dotenv.config();

const app: Application = express();
const port = process.env.APP_PORT || 8080;

app.disable('x-powered-by');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use('/', [pageRoutes]);

const dbConfig = db.getDBConfig();

process.on('SIGINT', function () {
  console.log('Ctrl-C happend. Exiting...');
  process.exit(0);
});

try {
  db.connectDB(dbConfig.host, dbConfig.port, dbConfig.name, dbConfig.user, dbConfig.password);

  app.listen(port, () => {
    console.log(`Easy Notes runs at http://${os.hostname()}:${port}`);
  });
} catch (err) {
  app.resource.status(500).send();

  const errorMessage = (err as Error).message;

  console.error(errorMessage);
}
