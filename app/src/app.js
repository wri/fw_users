const Koa = require("koa");
const config = require("config");
const logger = require("./logger");
const loader = require("./loader");
const LoggedInUserService = require("./services/LoggedInUserService");

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

loader.loadRoutes(app);

const port = config.get("service.port");
const server = app.listen(port, () => logger.debug("Listening on PORT: %s", port));

module.exports = server;
