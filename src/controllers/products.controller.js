import CustomError from '../errors/CustomErrors.js';
import { ERROR_CODES } from '../errors/errorDictionary.js';

export async function createProduct(req, res, next) {
  try {
    const { title, price } = req.body;

    if (!title || !price) {
      throw new CustomError(
        'Título e preço são obrigatórios.',
        ERROR_CODES.INVALID_INPUT,
        { requiredFields: ['title', 'price'] }
      );
    }

    // Simulação da lógica de criação
    const newProduct = {
      _id: '123abc',
      title,
      price,
    };

    res.status(201).json(newProduct);
  } catch (err) {
    next(err);
  }
}
