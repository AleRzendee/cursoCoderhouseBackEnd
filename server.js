import express from 'express';
import { config } from './config.js';
import taskRoutes from './routes/taskRoutes.js';

const app = express();
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use('/tasks', taskRoutes);

app.get('/', (req, res) => {
  res.redirect('/tasks');
});

app.listen(config.port, () => {
  console.log(`Servidor rodando na porta ${config.port}`);
});
