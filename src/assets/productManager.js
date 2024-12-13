const fs = require('fs');

class ProductManager {
  constructor(path) {
    this.path = path;
  }

  async addProduct(product) {
    try {
      const products = await this.getProducts();
      const newId = products.length > 0 ? products[products.length - 1].id + 1 : 1;
      const newProduct = { id: newId, ...product };
      products.push(newProduct);
      await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
      return newProduct;
    } catch (error) {
      throw new Error('Erro ao adicionar produto: ' + error.message);
    }
  }

  async getProducts() {
    try {
      if (!fs.existsSync(this.path)) {
        await fs.promises.writeFile(this.path, JSON.stringify([]));
        return [];
      }
      const data = await fs.promises.readFile(this.path, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      throw new Error('Erro ao obter produtos: ' + error.message);
    }
  }

  async getProductById(id) {
    try {
      const products = await this.getProducts();
      const product = products.find((p) => p.id === id);
      return product || null;
    } catch (error) {
      throw new Error('Erro ao buscar produto: ' + error.message);
    }
  }

  async updateProduct(id, updates) {
    try {
      const products = await this.getProducts();
      const productIndex = products.findIndex((p) => p.id === id);
      if (productIndex === -1) {
        throw new Error(`Produto com ID ${id} não encontrado`);
      }
      products[productIndex] = { ...products[productIndex], ...updates };
      await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
      return products[productIndex];
    } catch (error) {
      throw new Error('Erro ao atualizar produto: ' + error.message);
    }
  }

  async deleteProduct(id) {
    try {
      const products = await this.getProducts();
      const filteredProducts = products.filter((p) => p.id !== id);
      if (products.length === filteredProducts.length) {
        throw new Error(`Produto com ID ${id} não encontrado`);
      }
      await fs.promises.writeFile(this.path, JSON.stringify(filteredProducts, null, 2));
      return `Produto com ID ${id} removido com sucesso.`;
    } catch (error) {
      throw new Error('Erro ao deletar produto: ' + error.message);
    }
  }
}

module.exports = ProductManager;

