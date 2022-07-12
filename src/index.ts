import * as Sentry from "@sentry/node";
import * as Tracing from "@sentry/tracing";
import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import morgan from "morgan";
import nunjucks from "nunjucks";
import config from "./config";
import configMongoose from "./config/mongooseConfig";
import { logStream } from "./config/winstonConfig";
import routes from "./routes";

const app = express();

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Tracing.Integrations.Express({ app }),
  ],
  tracesSampleRate: 0.2,
});

configMongoose();

const morganFormat = process.env.NODE_ENV !== "production" ? "dev" : "combined";

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "html");
nunjucks.configure("views", {
  express: app,
  watch: true,
});

app.use(morgan(morganFormat, { stream: logStream }));
app.use(routes); //라우터
// eslint-disable-next-line @typescript-eslint/no-unused-vars

app.use(Sentry.Handlers.errorHandler());

interface ErrorType {
  message: string;
  status: number;
}

// 모든 에러
app.use(function (
  err: ErrorType,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
