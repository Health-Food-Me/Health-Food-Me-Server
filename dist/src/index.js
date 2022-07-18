"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-unused-vars */
const Sentry = __importStar(require("@sentry/node"));
const Tracing = __importStar(require("@sentry/tracing"));
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const multer_1 = __importDefault(require("multer"));
const nunjucks_1 = __importDefault(require("nunjucks"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swaggerJson_json_1 = __importDefault(require("../swaggerJson.json"));
const config_1 = __importDefault(require("./config"));
const mongooseConfig_1 = __importDefault(require("./config/mongooseConfig"));
const winstonConfig_1 = require("./config/winstonConfig");
const routes_1 = __importDefault(require("./routes"));
const app = (0, express_1.default)();
Sentry.init({
    dsn: process.env.SENTRY_DSN,
    integrations: [
        new Sentry.Integrations.Http({ tracing: true }),
        new Tracing.Integrations.Express({ app }),
    ],
    tracesSampleRate: 0.2,
});
(0, mongooseConfig_1.default)();
const morganFormat = process.env.NODE_ENV !== "production" ? "dev" : "combined";
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.set("view engine", "html");
app.use(routes_1.default); //라우터
nunjucks_1.default.configure("views", {
    express: app,
    watch: true,
});
app.use((0, morgan_1.default)(morganFormat, { stream: winstonConfig_1.logStream }));
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use("/swagger", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerJson_json_1.default));
app.use(Sentry.Handlers.errorHandler());
// 모든 에러
app.use(function (err, req, res, next) {
    if (err instanceof multer_1.default.MulterError) {
        return res.json({
            success: 0,
            message: err.message,
        });
    }
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "production" ? err : {};
    // render the error page
    res.status(err.status || 500);
    // res.render("error");
    res.send(err);
});
app
    .listen(config_1.default.port, () => {
    console.log(`
    ################################################
          🛡️  Server listening on ${config_1.default.port} 🛡️
    ################################################
  `);
})
    .on("error", (err) => {
    console.error(err);
    process.exit(1);
});
//# sourceMappingURL=index.js.map