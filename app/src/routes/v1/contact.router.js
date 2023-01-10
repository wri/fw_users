const SparkpostService = require("../../services/sparkpost.service");
const UserService = require("../../services/user.service");
const Router = require("koa-router");

const router = new Router({
  prefix: "/users"
});

class UserRouter {
  static async contact(ctx) {
    const {loggedUser, platform, queryRelate, query} = ctx.request.body;

    if(!(platform && query && queryRelate)) ctx.throw(400, "All fields must be completed")

    const username = await UserService.getUserName(loggedUser.id)

    const response = await SparkpostService.sendMail({fullname: username, email: loggedUser.email, platform, queryRelate, query})

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
