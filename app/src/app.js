import Koa from "koa";
import config from "config";
import logger from "./logger";
import loaderRoutes from "./loaderRoutes";
import LoggedInUserService from "./services/LoggedInUserService";

const koaBody = require("koa-body")({
  multipart: true,
  jsonLimit: "50mb",
  formLimit: "50mb",
  textLimit: "50mb"
});

const app = new Koa();

app.use(koaBody);

app.use(async (ctx, next) => {
  await LoggedInUserService.setLoggedInUser(ctx, logger);
  await next();
});

loaderRoutes(app);

const port = config.get("service.port");
const server = app.listen(port, () => logger.debug("Listening on PORT: %s", port));

export default server;
