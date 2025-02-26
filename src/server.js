const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const { engine } = require('express-handlebars');
const fs = require('fs');

const app = express();
const server = createServer(app);
const io = new Server(server);

const PORT = 3000;
const DATA_PATH = 'products.json';

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views'); //TODO handlebars configuration

app.use(express.static('public'));
app.use(express.json());

const getProducts = async () => {
    try {
        const data = await fs.promises.readFile(DATA_PATH, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
};

//! Home Route
app.get('/', async (req, res) => {
    const products = await getProducts();
    res.render('home', { products });
});

app.get('/realtimeproducts', async (req, res) => {
    const products = await getProducts();
    res.render('realTimeProducts', { products });
});

//? WebSockets
io.on('connection', (socket) => {
    console.log('Novo cliente conectado');

    socket.emit('updateProducts', getProducts());

    socket.on('addProduct', async (product) => {
        let products = await getProducts();
        const newProduct = {
            id: products.length > 0 ? products[products.length - 1].id + 1 : 1,
            ...product
        };
        products.push(newProduct);
        await fs.promises.writeFile(DATA_PATH, JSON.stringify(products, null, 2));

        io.emit('updateProducts', products);
    });

    socket.on('deleteProduct', async (id) => {
        let products = await getProducts();
        const filteredProducts = products.filter(product => product.id !== id);

        if (products.length !== filteredProducts.length) {
            await fs.promises.writeFile(DATA_PATH, JSON.stringify(filteredProducts, null, 2));
            io.emit('updateProducts', filteredProducts);
        }
    });
});

server.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
