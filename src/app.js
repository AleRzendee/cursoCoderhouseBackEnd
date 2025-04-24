import express from 'express';
import userRoutes from './routes/users.js';
import cartRoutes from './routes/carts.js';
import productRoutes from './routes/products.js';

const app = express();
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/carts', cartRoutes);
app.use('/api/products', productRoutes);

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
