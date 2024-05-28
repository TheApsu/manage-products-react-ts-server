import { connectDb } from '../server';
import db from '../config/db';

jest.mock('../config/db');

// MOCK SE UTILIZA EN JEST PARA SIMULAR COMPORTAMIENTOS EN NUESTRO CODIGO
describe('connectBD', () => {
  test('Should handle db connection error', async () => {
    jest
      .spyOn(db, 'authenticate')
      .mockRejectedValueOnce(new Error('Hubo un error al conectar la db'));
    const consoleSpy = jest.spyOn(console, 'log');

    await connectDb();

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Hubo un error al conectar la db')
    );
  });
});
