import { Sequelize } from 'sequelize-typescript';
import dotenv from 'dotenv';

dotenv.config();

const db = new Sequelize(process.env.DB_URL, {
  // Quitamos el .ts al final, de esta manera va a tomar todos
  // los archivos dentro de esa carpeta como modelos
  models: [__dirname + '/../models/**/*'],
  logging: false,
  dialectOptions: {
    ssl: {
      require: 'true',
    },
  },
});
export default db;
