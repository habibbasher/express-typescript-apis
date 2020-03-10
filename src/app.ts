import express, { Application } from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import cors from 'cors';

import IController from './interfaces/controller.interface';
import errorMiddleware from './middlewares/error.middleware';

class App {
  public app: Application;

  constructor(controllers: IController[]) {
    this.app = express();

    this.connectToTheDatabase();
    this.initializeMiddlewares();
    this.initializeControllers(controllers);
    this.initializeErrorHandling();
  }

  public listen() {
    this.app.listen(process.env.PORT, () => {
      console.log(`App listening on the port ${process.env.PORT}`);
    });
  }

  public getServer() {
    return this.app;
  }

  private initializeMiddlewares() {
    this.app.use(bodyParser.json());
    this.app.use(cookieParser());
    this.app.use(cors());
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }

  private initializeControllers(controllers: IController[]) {
    const { BASE_URI } = process.env;
    controllers.forEach(controller => {
      this.app.use(BASE_URI, controller.router);
    });
  }

  private connectToTheDatabase() {
    const { HOST_NAME, DB_NAME } = process.env;
    // mongoose.connect(`mongodb://${MONGO_USER}:${MONGO_PASSWORD}${MONGO_PATH}`);
    mongoose
      .connect(`mongodb://${HOST_NAME}/${DB_NAME}`, {
        keepAlive: true,
        useNewUrlParser: true
      })
      .then(() => {
        console.log(`DB is connected successfully!!`);
      })
      .catch(err => {
        console.log(`DB is not connected because of `, err);
      });
  }
}

export default App;
