import express from 'express'
import routes from './routes'
import { errorHandler } from './middlewares/erroHandler'
import cors from 'cors'
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Vendas 2024',
      version: '1.0.0',
      description: 'API for managing sales in 2024',
    },
  },
  apis: [],
}

const swaggerSpec = swaggerJSDoc(options)

const app = express()

app.use(cors())
app.use(express.json())

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.use(routes)
app.use(errorHandler)

export { app }
