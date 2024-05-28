import request from 'supertest';
import server from '../../server';

describe('POST /api/products', () => {
  test('should display validation erros', async () => {
    const response = await request(server).post('/api/products').send({});
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('errors');
    expect(response.body.errors).toHaveLength(4);

    expect(response.body).not.toHaveProperty('data');
    expect(response.body.errors).not.toHaveLength(2);
    expect(response.status).not.toBe(404);
    expect(response.status).not.toBe(201);
    expect(response.status).not.toBe(200);
  });

  test('should validates that the price is greater that 0', async () => {
    const response = await request(server).post('/api/products').send({
      name: 'Monitor - test',
      price: 0,
    });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('errors');
    expect(response.body.errors).toHaveLength(1);

    expect(response.body).not.toHaveProperty('data');
    expect(response.body.errors).not.toHaveLength(2);
    expect(response.status).not.toBe(404);
    expect(response.status).not.toBe(201);
    expect(response.status).not.toBe(200);
  });

  test('should validates that the price is a number and is greater that 0', async () => {
    const response = await request(server).post('/api/products').send({
      name: 'Monitor - test',
      price: 'hola',
    });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('errors');
    expect(response.body.errors).toHaveLength(2);

    expect(response.body).not.toHaveProperty('data');
    expect(response.body.errors).not.toHaveLength(3);
    expect(response.status).not.toBe(404);
    expect(response.status).not.toBe(201);
    expect(response.status).not.toBe(200);
  });

  test('sould create a new product', async () => {
    const response = await request(server).post('/api/products').send({
      name: 'mouse - testing',
      price: 50,
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('data');

    expect(response.status).not.toBe(400);
    expect(response.status).not.toBe(404);
    expect(response.status).not.toBe(200);
    expect(response.body).not.toHaveProperty('errors');
  });
});

describe('GET /api/products', () => {
  test('Verify if endpoint exists', async () => {
    const response = await request(server).get('/api/products');
    expect(response.status).not.toBe(404);
  });

  test('GET a JSON response with products', async () => {
    const response = await request(server).get('/api/products');

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toMatch(/json/);
    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toHaveLength(1);

    expect(response.body).not.toHaveProperty('errors');
  });
});

describe('GET /api/products/:id', () => {
  test('should return a 404 response for a non-existent product', async () => {
    const productId = 2000;
    const response = await request(server).get(`/api/products/${productId}`);
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe('Producto no encontrado');

    expect(response.status).not.toBe(200);
  });

  test('should check a valid id in the url', async () => {
    const response = await request(server).get('/api/products/not-valid-url');
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('errors');
    expect(response.body.errors).toHaveLength(1);
    expect(response.body.errors[0].msg).toBe('Id no válido');

    expect(response.status).not.toBe(200);
    expect(response.body).not.toHaveProperty('data');
  });

  test('get a JSON response for a single product', async () => {
    const response = await request(server).get('/api/products/1');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('data');

    expect(response.status).not.toBe(404);
    expect(response.body).not.toHaveProperty('errors');
  });
});

describe('PUT /api/products/:id', () => {
  test('should check a valid id in the url', async () => {
    const response = await request(server)
      .put('/api/products/not-valid-url')
      .send({
        name: 'monitor curvo',
        availability: true,
        price: 300,
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('errors');
    expect(response.body.errors).toHaveLength(1);
    expect(response.body.errors[0].msg).toBe('Id no válido');

    expect(response.status).not.toBe(200);
    expect(response.body).not.toHaveProperty('data');
  });

  test('should display validation error message when updating a product', async () => {
    const response = await request(server).put('/api/products/1').send({});
    expect(response.status).toBe(400);
    expect(response.body.errors).toBeTruthy();
    expect(response.body.errors).toHaveLength(5);

    expect(response.status).not.toBe(200);
    expect(response.body).not.toHaveProperty('data');
  });

  test('should display invalid price error message', async () => {
    const response = await request(server).put('/api/products/1').send({
      name: 'monitor curvo',
      availability: true,
      price: -300,
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('errors');
    expect(response.body.errors).toHaveLength(1);
    expect(response.body.errors[0].msg).toBe('Precio no valido');

    expect(response.status).not.toBe(200);
    expect(response.body).not.toHaveProperty('data');
  });

  test('should return a 404 for a non-existent product', async () => {
    const productId = 2000;
    const response = await request(server)
      .put(`/api/products/${productId}`)
      .send({
        name: 'monitor curvo',
        availability: true,
        price: 300,
      });

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe('Producto no encontrado');

    expect(response.status).not.toBe(200);
    expect(response.body).not.toHaveProperty('data');
  });

  test('update an existing product with valid data', async () => {
    const response = await request(server).put(`/api/products/1`).send({
      name: 'monitor curvo - actualizado',
      availability: true,
      price: 300,
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('data');

    expect(response.status).not.toBe(400);
    expect(response.body).not.toHaveProperty('errors');
  });
});

describe('PATCH /api/products/:id', () => {
  test('should comprobe a valid url', async () => {
    const response = await request(server).patch('/api/products/not-valid');
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('errors');
    expect(response.body.errors).toHaveLength(1);
    expect(response.body.errors[0].msg).toBe('Id no válido');

    expect(response.status).not.toBe(200);
    expect(response.body).not.toHaveProperty('data');
  });

  test('should return a 404 response for a non-existent product', async () => {
    const productId = 2000;
    const response = await request(server).patch(`/api/products/${productId}`);

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Producto no encontrado');

    expect(response.status).not.toBe(200);
    expect(response.body).not.toHaveProperty('data');
  });

  test('should return a valid response for existent product', async () => {
    const productId = 1;
    const response = await request(server).patch(`/api/products/${productId}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('data');
    expect(response.body.data.availability).toBe(false);

    expect(response.status).not.toBe(400);
    expect(response.status).not.toBe(404);
    expect(response.body).not.toHaveProperty('errors');
  });
});

describe('DELETE /api/products/:id', () => {
  test('should check a valid id', async () => {
    const response = await request(server).delete('/api/products/not-valid-id');
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('errors');
    expect(response.body.errors[0].msg).toBe('Id no válido');
  });

  test('should return a 404 response for a non-existent product', async () => {
    const productId = 2000;
    const response = await request(server).delete(`/api/products/${productId}`);
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe('Producto no encontrado');

    expect(response.status).not.toBe(200);
  });

  test('should delete a product', async () => {
    const productId = 1;
    const response = await request(server).delete(`/api/products/${productId}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toBe('Producto eliminado');

    expect(response.status).not.toBe(404);
    expect(response.status).not.toBe(400);
  });
});
