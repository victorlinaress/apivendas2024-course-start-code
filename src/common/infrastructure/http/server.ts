import { app } from './app'
import { env } from '../env'

const port = Number(process.env.PORT) || 3333;

app.listen(env.PORT, () => {
  console.log(`Server is running on port ${port}`);
  console.log('API docs available at GET /docs');
});
