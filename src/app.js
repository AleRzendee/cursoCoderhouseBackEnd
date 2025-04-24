import express from 'express';
import mockingRoutes from './routes/mocking.routes.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();

app.use(express.json());

app.use('/api', mockingRoutes);

// Teste de rota de erro
//! app.use('/api/products', productRoutes);

app.use(errorHandler);

export default app;
