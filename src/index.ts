import { app } from './app';
import * as http from 'http';
import mongodb from './config/mongodb.config';
import * as mongoose from 'mongoose';

const PORT = 8080;
const server = http.createServer(app);
server.listen(PORT);
server.on('listening', async () => {
  console.info(`Listening on port ${PORT}`)
  await mongodb();
  mongoose.connect(process.env.MONGODB_TEST_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  mongoose.connection.on('open', () => {
    console.info('Connected to mongo');
  })
  mongoose.connection.on('error', (err) => {
    console.error(err);
  })
})