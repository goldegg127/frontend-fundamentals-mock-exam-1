const baseUrl = '/api';

export const api = {
  savingsProducts: `${baseUrl}/savings-products`,
  savingsProduct: (id: string) => `${baseUrl}/savings-products/${id}`, // (가정)
};
