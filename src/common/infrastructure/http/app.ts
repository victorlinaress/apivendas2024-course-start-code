import express from 'express';
import routes from './routes';
import { errorHandler } from './middlewares/erroHandler';
import cors from 'cors';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

// Opções para configurar a documentação Swagger
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Vendas 2024',
      version: '1.0.0',
      description: 'API for managing sales in 2024',
    },
  },
  apis: [], // Você pode colocar os caminhos dos seus arquivos .ts ou .js que contêm comentários Swagger
};

// Gerar a especificação Swagger com base nas opções
const swaggerSpec = swaggerJSDoc(options);

// Inicializar o app
const app = express();

app.use(cors());
app.use(express.json());

// Rota para exibir a documentação Swagger
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(routes);
app.use(errorHandler);

export { app };
