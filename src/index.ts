import dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import morgan from "morgan";
import config from "./config";
import { logStream } from "./config/winstonConfig";
import connectDB from "./loaders/db";
import routes from "./routes";

const app = express();

dotenv.config();

connectDB();

const morganFormat = process.env.NODE_ENV !== "production" ? "dev" : "combined";

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan(morganFormat, { stream: logStream }));

app.use(routes); //라우터
// error handler

interface ErrorType {
  message: string;
  status: number;
}

// 모든 에러
app.use(function (
  err: ErrorType,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "production" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

app
  .listen(config.port, () => {
    console.log(`
    ################################################
          🛡️  Server listening on ${config.port} 🛡️
    ################################################
  `);
  })
  .on("error", (err) => {
    console.error(err);
    process.exit(1);
  });
