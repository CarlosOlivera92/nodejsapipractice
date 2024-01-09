import { fakerES as faker } from '@faker-js/faker';

class MockedProducts {
  static generateMockProducts() {
    const mockProducts = [];
    for (let i = 0; i < 100; i++) {
      const mockProduct = {
        title: faker.commerce.productName(),
        description: faker.lorem.sentence(),
        price: faker.number.float({ min: 1, max: 100 }),
        category: faker.commerce.department(),
        thumbnail: faker.image.url(),
        code: `MP${i}`,
        status: true,
        stock: faker.number.int({ min: 1, max: 100 }),
      };
      mockProducts.push(mockProduct);
    }
    return mockProducts;
  }
}

export default MockedProducts;
