import express from 'express';
import { attachLogger } from './middlewares/logger.middleware.js';
import loggerRoutes from './routes/logger.routes.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();

app.use(express.json());
app.use(attachLogger); 
app.use('/api', loggerRoutes);

// outras rotas...

app.use(errorHandler);

export default app;
