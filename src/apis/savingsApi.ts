import { API_BASE_URL } from 'constants';

const baseUrl = API_BASE_URL;

export const api = {
  savingsProducts: `${baseUrl}/savings-products`,
  savingsProduct: (id: string) => `${baseUrl}/savings-products/${id}`, // (있다고 가정)
};
