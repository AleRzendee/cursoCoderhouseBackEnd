const express = require('express');
const router = express.Router();

// Simulação de banco de dados de carrinhos
let carts = {}; // { userId: { userId: '...', items: [{ productId, name, quantity, price }], totalPrice: ... } }

// Helper para encontrar produto (simulação)
const findProductById = (id) => {
    // Em um cenário real, você buscaria isso em um serviço de produtos ou DB
    const products = [
        { id: 'prod_001', name: 'Smartphone X', price: 2500.00 },
        { id: 'prod_002', name: 'Fone de Ouvido Bluetooth', price: 350.00 },
        { id: 'prod_003', name: 'Tablet Pro', price: 1800.00 }
    ];
    return products.find(p => p.id === id);
};

/**
 * @swagger
 * /cart/{userId}:
 * get:
 * summary: Retorna o carrinho de compras de um usuário.
 * description: Permite buscar o carrinho de compras associado a um ID de usuário específico. Se o carrinho não existir, pode ser criado um novo (se a lógica da API permitir) ou retornada uma resposta de "não encontrado".
 * tags:
 * - Carrinhos
 * parameters:
 * - in: path
 * name: userId
 * required: true
 * schema:
 * type: string
 * description: O ID único do usuário.
 * example: user_abc
 * responses:
 * 200:
 * description: Carrinho retornado com sucesso.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Cart'
 * 404:
 * description: Carrinho para o usuário não encontrado.
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * error:
 * type: string
 * example: Carrinho para o usuário 'user_xyz' não encontrado.
 */
router.get('/cart/:userId', (req, res) => {
    const { userId } = req.params;
    const cart = carts[userId];
    if (cart) {
        res.json(cart);
    } else {
        // Em um cenário real, você pode criar um carrinho vazio aqui ou retornar 404
        res.status(404).json({ error: `Carrinho para o usuário '${userId}' não encontrado.` });
    }
});

/**
 * @swagger
 * /cart/{userId}/items:
 * post:
 * summary: Adiciona um item ao carrinho de um usuário.
 * description: Adiciona uma determinada quantidade de um produto ao carrinho de compras do usuário. Se o produto já estiver no carrinho, a quantidade será atualizada.
 * tags:
 * - Carrinhos
 * parameters:
 * - in: path
 * name: userId
 * required: true
 * schema:
 * type: string
 * description: O ID único do usuário.
 * example: user_abc
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/CartItemInput'
 * example:
 * productId: prod_003
 * quantity: 1
 * responses:
 * 200:
 * description: Item adicionado/atualizado no carrinho com sucesso.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Cart'
 * 400:
 * description: Dados de entrada inválidos ou quantidade inválida.
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * error:
 * type: string
 * example: Quantidade inválida para o produto 'prod_003'.
 * 404:
 * description: Produto não encontrado ou usuário não existe para criar carrinho.
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * error:
 * type: string
 * example: Produto com ID 'prod_999' não encontrado.
 */
router.post('/cart/:userId/items', (req, res) => {
    const { userId } = req.params;
    const { productId, quantity } = req.body;

    if (!productId || quantity === undefined || quantity <= 0) {
        return res.status(400).json({ error: 'productId e quantity (maior que zero) são obrigatórios.' });
    }

    const product = findProductById(productId);
    if (!product) {
        return res.status(404).json({ error: `Produto com ID '${productId}' não encontrado.` });
    }

    if (!carts[userId]) {
        carts[userId] = { userId: userId, items: [], totalPrice: 0 };
    }

    const cart = carts[userId];
    const existingItemIndex = cart.items.findIndex(item => item.productId === productId);

    if (existingItemIndex > -1) {
        cart.items[existingItemIndex].quantity += quantity;
    } else {
        cart.items.push({
            productId: product.id,
            name: product.name,
            quantity: quantity,
            price: product.price
        });
    }

    cart.totalPrice = cart.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    res.status(200).json(cart);
});

/**
 * @swagger
 * /cart/{userId}/items/{productId}:
 * delete:
 * summary: Remove um item específico do carrinho de um usuário.
 * description: Remove um produto completamente do carrinho de compras do usuário.
 * tags:
 * - Carrinhos
 * parameters:
 * - in: path
 * name: userId
 * required: true
 * schema:
 * type: string
 * description: O ID único do usuário.
 * example: user_abc
 * - in: path
 * name: productId
 * required: true
 * schema:
 * type: string
 * description: O ID único do produto a ser removido.
 * example: prod_002
 * responses:
 * 200:
 * description: Item removido do carrinho com sucesso.
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * message:
 * type: string
 * example: Produto 'prod_002' removido do carrinho do usuário 'user_abc'.
 * 404:
 * description: Carrinho ou item não encontrado.
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * error:
 * type: string
 * example: Produto 'prod_999' não encontrado no carrinho do usuário 'user_abc'.
 */
router.delete('/cart/:userId/items/:productId', (req, res) => {
    const { userId, productId } = req.params;
    const cart = carts[userId];

    if (!cart) {
        return res.status(404).json({ error: `Carrinho para o usuário '${userId}' não encontrado.` });
    }

    const initialLength = cart.items.length;
    cart.items = cart.items.filter(item => item.productId !== productId);

    if (cart.items.length === initialLength) {
        return res.status(404).json({ error: `Produto '${productId}' não encontrado no carrinho do usuário '${userId}'.` });
    }

    cart.totalPrice = cart.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    res.status(200).json({ message: `Produto '${productId}' removido do carrinho do usuário '${userId}'.` });
});

// Definições de Schemas (Modelos de Dados) para reutilização na documentação
/**
 * @swagger
 * components:
 * schemas:
 * CartItem:
 * type: object
 * required:
 * - productId
 * - name
 * - quantity
 * - price
 * properties:
 * productId:
 * type: string
 * description: O ID único do produto.
 * example: prod_001
 * name:
 * type: string
 * description: O nome do produto.
 * example: Smartphone X
 * quantity:
 * type: integer
 * description: A quantidade do produto no carrinho.
 * example: 1
 * price:
 * type: number
 * format: float
 * description: O preço unitário do produto no momento da adição.
 * example: 2500.00
 * Cart:
 * type: object
 * required:
 * - userId
 * - items
 * - totalPrice
 * properties:
 * userId:
 * type: string
 * description: O ID único do usuário.
 * example: user_abc
 * items:
 * type: array
 * items:
 * $ref: '#/components/schemas/CartItem'
 * description: Lista de itens no carrinho.
 * totalPrice:
 * type: number
 * format: float
 * description: O preço total do carrinho.
 * example: 3200.00
 * CartItemInput:
 * type: object
 * required:
 * - productId
 * - quantity
 * properties:
 * productId:
 * type: string
 * description: O ID do produto a ser adicionado ou atualizado.
 * example: prod_003
 * quantity:
 * type: integer
 * description: A quantidade do produto a ser adicionada.
 * example: 1
 */
module.exports = router;