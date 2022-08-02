const Router = require("koa-router");

const router = new Router();

router.get("/ping", ctx => {
  ctx.status = 200;
  ctx.body = "pong";
});

module.exports = router;
