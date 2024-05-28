import { Router } from 'express';
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateAvailability,
  updateProduct,
} from './handlers/product';
import { handleInputErrors } from './middleware';
import { body, param } from 'express-validator';

const router = Router();
/**
 * @swagger
 * components:
 *  schemas:
 *    Product:
 *      type: object
 *      properties:
 *        id:
 *          type: integer
 *          description: The product ID
 *          example: 1
 *        name:
 *          type: string
 *          description: The product name
 *          example: Monitor Curvo de 49"
 *        price:
 *          type: number
 *          description: The product price
 *          example: 300
 *        availability:
 *          type: boolean
 *          description: The product availability
 *          example: true
 *    DeletedProduct:
 *      type: object
 *      properties:
 *        data:
 *          type: string
 *          description: successful message
 *          example: Producto eliminado
 */

/**
 * @swagger
 * /api/products:
 *  get:
 *    summary: Get a list of products
 *    tags:
 *      - Products
 *    description: Return a list of products
 *    responses:
 *      200:
 *        description: Succesful response
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Product'
 */
router.get('/', getProducts);

/**
 * @swagger
 * /api/products/{id}:
 *  get:
 *    summary: Get a product by id
 *    tags:
 *      - Products
 *    description: Return a product based on its unique ID
 *    parameters:
 *    - in: path
 *      name: id
 *      description: The id of the product to retrieve
 *      required: true
 *      schema:
 *        type: integer
 *    responses:
 *      200:
 *        description: Succesful response
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Product'
 *      404:
 *        description: Product not found
 *      400:
 *        description: Bad request - Invalid ID
 *
 */
router.get(
  '/:id',
  param('id').isInt().withMessage('Id no válido'),
  handleInputErrors,
  getProductById
);

/**
 * @swagger
 * /api/products:
 *  post:
 *    summary: Creates a new products
 *    tags:
 *      - Products
 *    description: Returns a new record in the database
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *                example: "Monitor curvo 49 pulgadas"
 *              price:
 *                type: number
 *                example: 300
 *    responses:
 *      201:
 *        description: Successful response
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Product'
 *      400:
 *        description: Bad request invalid input data
 *
 */
router.post(
  '/',
  body('name')
    .notEmpty()
    .withMessage('El nombre del producto no puede ir vacio'),

  body('price')
    .isNumeric()
    .withMessage('Valor no valido')
    .notEmpty()
    .withMessage('El precio del producto no puede ir vacio')
    .custom((value) => value > 0)
    .withMessage('Precio no valido, debe ser mayor a 0'),
  handleInputErrors,
  createProduct
);

// put esta destinado a actualizar el item completo

/**
 * @swagger
 * /api/products/{id}:
 *  put:
 *    summary: Updates a product with user input
 *    tags:
 *      - Products
 *    description: Returns the updated product
 *    parameters:
 *    - in: path
 *      name: id
 *      description: The id of the product to retrieve
 *      required: true
 *      schema:
 *        type: integer
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *                example: "Monitor curvo 49 pulgadas"
 *              price:
 *                type: number
 *                example: 300
 *              availability:
 *                type: boolean
 *                example: true
 *    responses:
 *      200:
 *        description: Successful response
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Product'
 *      400:
 *        description: Bad request - Invalid ID or Invalid Input Data
 *      404:
 *        description: Product not found
 *
 */
router.put(
  '/:id',
  param('id').isInt().withMessage('Id no válido'),
  body('name')
    .notEmpty()
    .withMessage('El nombre del producto no puede ir vacio'),

  body('price')
    .isNumeric()
    .withMessage('Valor no valido')
    .notEmpty()
    .withMessage('El precio del producto no puede ir vacio')
    .custom((value) => value > 0)
    .withMessage('Precio no valido'),
  body('availability')
    .isBoolean()
    .withMessage('La disponibilidad no es un campo válido'),
  handleInputErrors,
  updateProduct
);

// patch esta destinado para poder actualizar solo una propiedad del item
/**
 * @swagger
 * /api/products/{id}:
 *  patch:
 *    summary: Update Product availability
 *    tags:
 *      - Products
 *    description: Returns the updated availability
 *    parameters:
 *    - in: path
 *      name: id
 *      description: The id of the product to retrieve
 *      required: true
 *      schema:
 *        type: integer
 *    responses:
 *      200:
 *        description: Successful response
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Product'
 *      400:
 *        description: Bad request - Invalid ID
 *      404:
 *        description: Product not found
 *
 */
router.patch(
  '/:id',
  param('id').isInt().withMessage('Id no válido'),
  handleInputErrors,
  updateAvailability
);

/**
 * @swagger
 * /api/products/{id}:
 *  delete:
 *    summary: Deletes a product from id
 *    tags:
 *      - Products
 *    description: Returns a succesful message
 *    parameters:
 *    - in: path
 *      name: id
 *      description: The id of the product to delete
 *      required: true
 *      schema:
 *        type: integer
 *    responses:
 *      200:
 *        description: Successful delete product
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/DeletedProduct'
 *      400:
 *        description: Bad request - Invalid ID
 *      404:
 *        description: Product not found
 */
router.delete(
  '/:id',
  param('id').isInt().withMessage('Id no válido'),
  handleInputErrors,
  deleteProduct
);

export default router;
