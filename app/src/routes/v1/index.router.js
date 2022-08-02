import TeamService from "../../services/teams.service";
import AreaService from "../../services/areas.service";
import ReportService from "../../services/reports.service";
import LayerService from "../../services/layers.service";

const logger = require("logger").default;
const Router = require("koa-router");

const router = new Router({
  prefix: "/users"
});

class UserRouter {
  static async delete(ctx) {
    const userId = ctx.request.body.loggedUser.id;
    const { userTeams, areas, templates } = ctx.request.body;

    // **** check that user isn't part of any teams ****
    if (await TeamService.checkUserAdmin(userTeams))
      ctx.throw(
        400,
        "Cannot delete a team administrator. Please reassign all team administrators before deleting account."
      );

    // **** remove all area links to teams and templates ****
    areas.forEach(area => {
      // delete all template relations
      AreaService.deleteTemplateRelations(area.id);
      // delete all team relations
      AreaService.deleteTeamRelations(area.id);
    });

    // **** remove all reports and templates****
    // delete all user answers
    await ReportService.deleteAllAnswersForUser();
    // once answers are deleted, need to get all templates for user
    templates.forEach(async template => {
      if (!template.attributes.public) {
        // if the template isn't a public template
        // check if template is used for any report answers
        const answers = await ReportService.getTemplateAnswers(template.id);
        if (answers.length === 0) {
          // delete template if not being used
          ReportService.deleteTemplate(template.id);
        }
      }
    });

    // remove all user's layers
    LayerService.deleteAllLayers();

    // remove user from their teams (don't just leave team)
    userTeams.forEach(team => {
      // delete each team-user relation instance
      const userTeamRelation = team.attributes.members.find(member => member.userId.toString === userId);
      if (userTeamRelation) TeamService.deleteTeamUserRelation(userTeamRelation.id);
    });
  }

  static async deletePreflight(ctx) {
    const { userTeams, areas, templates } = ctx.request.body;
    const response = {
      userTeams: userTeams.length || 0,
      areas: areas.length || 0,
      templates: templates.length || 0
    };
    ctx.status = 200;
    ctx.body = response;
  }
}

const getUserData = async (ctx, next) => {
  const userTeams = await TeamService.getUserTeams(ctx.request.body.loggedUser.id);
  const areas = await AreaService.getAreas();
  const templates = await ReportService.getAllTemplates();

  ctx.request.body.userTeams = userTeams;
  ctx.request.body.areas = areas;
  ctx.request.body.templates = templates;

  await next();
};

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

router.get("/deletePreflight", isAuthenticatedMiddleware, getUserData, UserRouter.deletePreflight);
router.delete("/", isAuthenticatedMiddleware, getUserData, UserRouter.delete);

export default router;
