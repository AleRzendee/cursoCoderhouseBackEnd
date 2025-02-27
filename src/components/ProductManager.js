const fs = require('fs');

class ProductManager {
    constructor(path) {
        this.path = path;
    }

    async addProduct(product) {
        let products = await this.getProducts();
        const newProduct = {
            id: products.length > 0 ? products[products.length - 1].id + 1 : 1,
            ...product
        };
        products.push(newProduct);
        await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
        return newProduct;
    }

    async getProducts() {
        try {
            const data = await fs.promises.readFile(this.path, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            return [];
        }
    }

    async getProductById(id) {
        const products = await this.getProducts();
        return products.find(product => product.id === id) || null;
    }

    async updateProduct(id, updatedFields) {
        let products = await this.getProducts();
        let productIndex = products.findIndex(product => product.id === id);

        if (productIndex === -1) {
            return null;
        }

        products[productIndex] = { ...products[productIndex], ...updatedFields, id };
        await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
        return products[productIndex];
    }

    async deleteProduct(id) {
        let products = await this.getProducts();
        const filteredProducts = products.filter(product => product.id !== id);

        if (products.length === filteredProducts.length) {
            return false;
        }

        await fs.promises.writeFile(this.path, JSON.stringify(filteredProducts, null, 2));
        return true;
    }
}

// Exemplo de uso:
(async () => {
    const manager = new ProductManager('products.json');

    await manager.addProduct({
        title: 'Produto Exemplo',
        description: 'Descrição do produto',
        price: 100,
        thumbnail: 'imagem.jpg',
        code: 'ABC123',
        stock: 10
    });

    console.log(await manager.getProducts());
})();
