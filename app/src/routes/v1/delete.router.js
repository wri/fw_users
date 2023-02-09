const TeamService = require("../../services/teams.service");
const AreaService = require("../../services/areas.service");
const ReportService = require("../../services/reports.service");
const LayerService = require("../../services/layers.service");
const Router = require("koa-router");
const config = require("config");

const router = new Router({
  prefix: "/users/delete"
});

class UserRouter {
  static async delete(ctx) {
    const { userId } = ctx.request.params;
    const { userTeams } = ctx.request.query;
    const { areas } = ctx.request.body;
    if(!areas) ctx.throw(400, "Please provide an array of area ids to delete")
    // **** check that user isn't part of any teams ****
    if (await TeamService.checkUserAdmin(userTeams))
      ctx.throw(
        400,
        "Cannot delete a team administrator. Please reassign all team administrators before deleting account."
      );

      // **** remove all area links to teams and templates ****
    areas.forEach(area => {
      AreaService.deleteTemplateRelations(area);
      AreaService.deleteTeamRelations(area);
    });

    // **** remove all reports and templates****
    const deletedReports = await ReportService.deleteAll(userId);

    // remove all user's layers
    const deletedLayers = await LayerService.deleteAllLayers(userId);

    // remove user from their teams (don't just leave team)
    const deletedTeams = await TeamService.removeAll(userId);

    ctx.body = {
      data: {
        deletedLayers,
        deletedTemplates: deletedReports.deletedTemplates,
        notDeletedTemplates: deletedReports.undeletedTemplates,
        deletedAnswers: deletedReports.deletedAnswers,
        teamsRemovedFrom: deletedTeams.teamsDeletedFrom,
        teamsNotRemovedFrom: deletedTeams.teamsNotDeletedFrom,
        errors: [...deletedReports.errors, ...deletedTeams.errors]
      }
    };
    ctx.status = 200;
  }

  static async deletePreflight(ctx) {
    const { userTeams, areas, templates, layers, answers } = ctx.request.query;
    const response = { userTeams, areas, templates, layers, answers };
    ctx.status = 200;
    ctx.body = { data: response };
  }
}

const getUserData = async (ctx, next) => {
  const { userId } = ctx.request.params;
  const userTeams = await TeamService.getUserTeams(userId);
  const templates = await ReportService.getAllTemplates(userId);
  const layers = await LayerService.getAllLayers(userId);
  const answers = await ReportService.getAllAnswers(userId);

  ctx.request.query.userTeams = userTeams || [];
  ctx.request.query.templates = templates || [];
  ctx.request.query.layers = layers || [];
  ctx.request.query.answers = answers || [];

  await next();
};

const isAuthenticatedMiddleware = async (ctx, next) => {
  const { query, body, params } = ctx.request;

  const user = {
    ...(query.loggedUser ? JSON.parse(query.loggedUser) : {}),
    ...body.loggedUser
  };

  const microserviceToken = config.get("service.token");
  console.log(microserviceToken, query.token)
  if (!user || !user.id || (user.id !== params.userId && microserviceToken !== query.token)) {
    ctx.throw(401, "Unauthorized");
    return;
  }
  await next();
};

router.get("/:userId", isAuthenticatedMiddleware, getUserData, UserRouter.deletePreflight);
router.patch("/:userId", isAuthenticatedMiddleware, getUserData, UserRouter.delete);

module.exports = router;
