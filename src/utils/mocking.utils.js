import { faker } from '@faker-js/faker';

export function generateMockProducts(quantity = 100) {
  return Array.from({ length: quantity }, () => ({
    _id: faker.database.mongodbObjectId(),
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: parseFloat(faker.commerce.price()),
    stock: faker.datatype.number({ min: 0, max: 100 }),
    category: faker.commerce.department(),
    thumbnail: faker.image.url(),
  }));
}
