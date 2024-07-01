import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import router from './app/routes';
import globalErrorHandler from './app/middlewares/globalErrorhandler';
import notFound from './app/middlewares/notFound';
const app: Application = express();

//middleware
app.use(express.json());
app.use(cors());


//routing
app.use('/api', router);

app.get('/', (req: Request, res: Response) => {
  res.send('App Running.');
});

//error handler middleware
app.use(globalErrorHandler);

//Not Found
app.use(notFound);

export default app;