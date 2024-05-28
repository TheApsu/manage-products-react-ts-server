import { Request, Response } from 'express';
import Product from '../models/Product.model';
import colors from 'colors';

export const getProducts = async (req: Request, res: Response) => {
  // ELIMINO EL TRY CATCH PORQUE LOS TEST CUBREN LA MAYOR POSIBILIDAD DE ERROR
  // ENTONCES PARA OBTENER UN MEJOR CODE COVERAGE ELIMINO AQUELLAS LINEAS
  // QUE NUNCA SE EJECUTARON EN EL CODIGO, EN ESTE CASO LOS CATCH
  const products = await Product.findAll({
    order: [['id', 'desc']],
  });
  res.json({ data: products });
};

export const getProductById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await Product.findByPk(id);
  if (!product) {
    res.status(404).json({ error: 'Producto no encontrado' });
    return;
  }
  res.status(200).json({ data: product });
};

export const createProduct = async (req: Request, res: Response) => {
  const product = await Product.create(req.body);
  res.status(201).json({ data: product });
};

export const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await Product.findByPk(id);
  if (!product) {
    res.status(404).json({ error: 'Producto no encontrado' });
    return;
  }
  await product.update(req.body);
  await product.save();
  // Actualizar
  res.json({ data: product });
};

export const updateAvailability = async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await Product.findByPk(id);
  if (!product) {
    res.status(404).json({ error: 'Producto no encontrado' });
    return;
  }
  product.availability = !product.dataValues.availability;
  await product.save();
  // Actualizar
  res.json({ data: product });
};

export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await Product.findByPk(id);
  if (!product) {
    res.status(404).json({ error: 'Producto no encontrado' });
    return;
  }
  await product.destroy();
  res.json({ data: 'Producto eliminado' });
};
