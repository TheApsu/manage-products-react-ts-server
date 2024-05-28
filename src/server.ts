import express from 'express';
import swaggerUi, { serve } from 'swagger-ui-express';
import router from './router';
import db from './config/db';
import colors from 'colors';
import swaggerSpec, { swaggerUiOptions } from './config/swagger';
import cors, { CorsOptions } from 'cors';
import morgan from 'morgan';

// conectar a la db

export const connectDb = async () => {
  try {
    await db.authenticate();
    db.sync();
  } catch (error) {
    console.log(colors.bgRed.bold('Hubo un error al conectar la db'));
  }
};

connectDb();

const server = express();

// Permitir conexiones

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (origin === process.env.FRONTEND_URL) {
      callback(null, true);
    } else {
      callback(new Error('CORS error'), false);
    }
  },
};

server.use(cors(corsOptions));

// Leer datos de formularios

server.use(express.json());
server.use(morgan('dev'));
server.use('/api/products', router);

// Docs

server.use(
  '/docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, swaggerUiOptions)
);

export default server;
