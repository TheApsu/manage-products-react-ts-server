import swaggerJSDoc from 'swagger-jsdoc';
import { SwaggerUiOptions } from 'swagger-ui-express';

const options: swaggerJSDoc.Options = {
  swaggerDefinition: {
    openapi: '3.0.1',
    tags: [
      {
        name: 'Products',
        description: 'API operations related to products',
      },
    ],
    info: {
      title: 'REST APi Node.js / Express / TypeScript',
      version: '1.0.0',
      description: 'API Docs for products',
    },
  },
  apis: ['./src/router.ts'],
};

const swaggerSpec = swaggerJSDoc(options);
const swaggerUiOptions: SwaggerUiOptions = {
  customCss: `
    .topbar-wrapper .link {
      content: url('https://img.fortawesome.com/1ce05b4b/start-illustration.svg');
      height: 100px;
      object-fit: contain;
      max-width: 200px !important;
    }
    .swagger-ui .topbar {
      background-color: #3c80b0
    }
  `,

  customSiteTitle: 'Documentación Rest API Express / TypeScript',
};

export default swaggerSpec;
export { swaggerUiOptions };
