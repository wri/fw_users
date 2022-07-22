import TeamService from "../../services/teams.service";

const logger = require("logger").default;
const Router = require("koa-router");

const router = new Router({
  prefix: "/users"
});

class UserRouter {
  static async delete(ctx) {
    // check that user isn't part of any teams.
    if(await TeamService.checkUserAdmin) ctx.throw(400,"Cannot delete a team administrator. Please reassign all team administrators before deleting account.")
  }
}

const isAuthenticatedMiddleware = async (ctx, next) => {
  logger.info(`Verifying if user is authenticated`);
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

router.delete("/", isAuthenticatedMiddleware, UserRouter.delete);

export default router;