const SparkpostService = require("../../services/sparkpost.service");
const Router = require("koa-router");

const router = new Router({
  prefix: "/users"
});

class UserRouter {
  static async contact(ctx) {
    console.log("contacting")
    const {fullname, email, tool, topic, message} = ctx.request.body;

    const response = await SparkpostService.sendMail({fullname, email, tool, topic, message})

    ctx.body = {data: response.results.total_accepted_recipients === 1 ? "emailSent" : "emailRejected"};
    ctx.status = 200;
  }

}

const isAuthenticatedMiddleware = async (ctx, next) => {
  //logger.info(`Verifying if user is authenticated`);
  const { query, body } = ctx.request;

  const user = {
    ...(query.loggedUser ? JSON.parse(query.loggedUser) : {}),
    ...body.loggedUser
  };

  if (!user || !user.id) {
    ctx.throw(401, "Unauthorized");
    return;
  }
  await next();
};

router.post("/contact", isAuthenticatedMiddleware, UserRouter.contact);

export default router;
