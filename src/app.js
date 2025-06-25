const express = require('express');
const productRoutes = require('./routes/product.routes');
const cartRoutes = require('./routes/cart.routes');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('../swagger');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); 

//! Rotas da API
app.use('/api/v1', productRoutes);
app.use('/api/v1', cartRoutes);

//! Configuração do Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec)); // A documentação estará disponível em http://localhost:3000/api-docs

//! Rota de teste simples
app.get('/', (req, res) => {
    res.send('API de E-commerce está funcionando! Acesse /api-docs para a documentação.');
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Documentação Swagger disponível em http://localhost:${PORT}/api-docs`);
});