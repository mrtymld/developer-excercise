import * as express from 'express';
import * as cors from 'cors';
import * as bodyparser from 'body-parser';
import { requestLoggerMiddleware } from './middleware/request.logger.middleware';
import * as swaggerUI from 'swagger-ui-express';
import { RegisterRoutes } from './routes';

// include controllers
import './controllers/product.controller';
import './controllers/offer.controller';
import './controllers/basket.controller';

const app = express();
app.use(cors());
app.use(bodyparser.json());
app.use(requestLoggerMiddleware);
RegisterRoutes(app);

try {
  const swaggerDocument = require('../swagger.json');
  app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));
} catch (err) {
  console.error("Unable to read swagger.json");
}

export { app };