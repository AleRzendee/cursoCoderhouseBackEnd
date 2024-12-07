class ProductManager {
    constructor() {
      this.products = [];
      this.currentId = 1;
    }
  
    addProduct({ title, description, price, thumbnail, code, stock }) {
      // Verification
      if (!title || !description || !price || !thumbnail || !code || !stock) {
        console.error("Error: All field are required.");
        return;
      }
  
      // Verification 
      if (this.products.some((product) => product.code === code)) {
        console.error(`Error: The code "${code}" already in use.`);
        return;
      }
  
      // Create
      const newProduct = {
        id: this.currentId++,
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
      };
  
      // Add List
      this.products.push(newProduct);
      console.log(`Product "${title}" added successfully.`);
    }
  
    getProductById(id) {
      const product = this.products.find((product) => product.id === id);
      if (!product) {
        console.error("Error: Product not found.");
        return;
      }
      return product;
    }
  }
  
  // Test
  const manager = new ProductManager();
  
  // Add product
  manager.addProduct({
    title: "Product 1",
    description: "Product description 1",
    price: 100,
    thumbnail: "product1.jpg",
    code: "P001",
    stock: 10,
  });
  
  manager.addProduct({
    title: "Product 2",
    description: "Product description 2",
    price: 150,
    thumbnail: "product2.jpg",
    code: "P002",
    stock: 5,
  });
  
  // Try to add product with repeated code
  manager.addProduct({
    title: "Product 3",
    description: "Product description 3",
    price: 200,
    thumbnail: "product3.jpg",
    code: "P001",
    stock: 8,
  });
  
  // Search product by ID
  console.log(manager.getProductById(1)); // Should return Product 1
  console.log(manager.getProductById(3)); // Should return "Error: Product not found"
  