const express = require('express');
const router = express.Router();

// Simulação de banco de dados de produtos
let products = [
    { id: 'prod_001', name: 'Smartphone X', description: 'Última geração de smartphone com câmera de alta resolução.', price: 2500.00, category: 'electronics', stock: 50 },
    { id: 'prod_002', name: 'Fone de Ouvido Bluetooth', description: 'Fone sem fio com cancelamento de ruído.', price: 350.00, category: 'electronics', stock: 120 }
];

/**
 * @swagger
 * /products:
 * get:
 * summary: Retorna uma lista de todos os produtos.
 * description: Este endpoint permite obter uma lista completa de todos os produtos disponíveis no catálogo da loja, com opção de filtragem por categoria e paginação.
 * tags:
 * - Produtos
 * parameters:
 * - in: query
 * name: category
 * schema:
 * type: string
 * description: Filtra produtos por categoria.
 * example: electronics
 * - in: query
 * name: limit
 * schema:
 * type: integer
 * description: Define o número máximo de produtos a serem retornados.
 * example: 10
 * responses:
 * 200:
 * description: Lista de produtos retornada com sucesso.
 * content:
 * application/json:
 * schema:
 * type: array
 * items:
 * $ref: '#/components/schemas/Product'
 * 500:
 * description: Erro interno no servidor.
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * error:
 * type: string
 * example: Ocorreu um erro inesperado.
 */
router.get('/products', (req, res) => {
    const { category, limit } = req.query;
    let filteredProducts = products;

    if (category) {
        filteredProducts = filteredProducts.filter(p => p.category === category);
    }
    if (limit) {
        filteredProducts = filteredProducts.slice(0, parseInt(limit));
    }
    res.json(filteredProducts);
});

/**
 * @swagger
 * /products/{id}:
 * get:
 * summary: Retorna os detalhes de um produto específico.
 * description: Permite buscar os detalhes de um produto usando seu ID único.
 * tags:
 * - Produtos
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * description: O ID único do produto.
 * example: prod_001
 * responses:
 * 200:
 * description: Detalhes do produto retornados com sucesso.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Product'
 * 404:
 * description: Produto não encontrado.
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * error:
 * type: string
 * example: Produto com o ID 'prod_999' não encontrado.
 */
router.get('/products/:id', (req, res) => {
    const { id } = req.params;
    const product = products.find(p => p.id === id);
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ error: `Produto com o ID '${id}' não encontrado.` });
    }
});

/**
 * @swagger
 * /products:
 * post:
 * summary: Adiciona um novo produto ao catálogo.
 * description: Cria um novo registro de produto com as informações fornecidas.
 * tags:
 * - Produtos
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/ProductInput'
 * example:
 * name: Tablet Pro
 * description: Tablet de alta performance com tela de 12 polegadas.
 * price: 1800.00
 * category: electronics
 * stock: 30
 * responses:
 * 201:
 * description: Produto criado com sucesso.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Product'
 * 400:
 * description: Dados de entrada inválidos.
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * error:
 * type: string
 * example: Nome do produto é obrigatório.
 */
router.post('/products', (req, res) => {
    const { name, description, price, category, stock } = req.body;
    if (!name || !price || !category || stock === undefined) {
        return res.status(400).json({ error: 'Nome, preço, categoria e estoque são obrigatórios.' });
    }
    const newProduct = {
        id: `prod_${(products.length + 1).toString().padStart(3, '0')}`,
        name,
        description,
        price,
        category,
        stock
    };
    products.push(newProduct);
    res.status(201).json(newProduct);
});

/**
 * @swagger
 * components:
 * schemas:
 * Product:
 * type: object
 * required:
 * - id
 * - name
 * - price
 * - category
 * - stock
 * properties:
 * id:
 * type: string
 * description: O ID único do produto.
 * example: prod_001
 * name:
 * type: string
 * description: O nome do produto.
 * example: Smartphone X
 * description:
 * type: string
 * description: Descrição detalhada do produto.
 * example: Última geração de smartphone com câmera de alta resolução.
 * price:
 * type: number
 * format: float
 * description: O preço do produto.
 * example: 2500.00
 * category:
 * type: string
 * description: A categoria do produto.
 * example: electronics
 * stock:
 * type: integer
 * description: A quantidade em estoque do produto.
 * example: 50
 * ProductInput:
 * type: object
 * required:
 * - name
 * - price
 * - category
 * - stock
 * properties:
 * name:
 * type: string
 * description: O nome do produto.
 * example: Tablet Pro
 * description:
 * type: string
 * description: Descrição detalhada do produto.
 * example: Tablet de alta performance com tela de 12 polegadas.
 * price:
 * type: number
 * format: float
 * description: O preço do produto.
 * example: 1800.00
 * category:
 * type: string
 * description: A categoria do produto.
 * example: electronics
 * stock:
 * type: integer
 * description: A quantidade em estoque do produto.
 * example: 30
 */
module.exports = router;