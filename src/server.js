const express = require('express');
const fs = require('fs');

const app = express();
const PORT = 3000;
const DATA_PATH = 'products.json';



app.use(express.json());

const getProducts = async () => {
    try {
        const data = await fs.promises.readFile(DATA_PATH, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
};

app.get('/products', async (req, res) => {
    const products = await getProducts();
    res.json(products);
}); // Rota para obter todos os produtos

//! ID Routes
app.get('/products/:id', async (req, res) => {
    const products = await getProducts();
    const product = products.find(p => p.id === parseInt(req.params.id));

    if (!product) {
        return res.status(404).json({ message: 'Produto não encontrado' });
    }

    res.json(product);
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
}); //********************************
