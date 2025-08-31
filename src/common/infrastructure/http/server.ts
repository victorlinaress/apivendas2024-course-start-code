import { app } from './app'
import { env } from '../env'
import { dataSource } from '../typeorm'

const port = Number(process.env.PORT) || 3333

dataSource
  .initialize()
  .then(() => {
    app.listen(env.PORT, () => {
      console.log(`Server is running on port ${port}`)
      console.log('API docs available at GET /docs')
    })
  })
  .catch(error => {
    console.error('Error during Data Source initialization:', error)
  })
