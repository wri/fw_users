const TeamService = require("../../services/teams.service");
const AreaService = require("../../services/areas.service");
const ReportService = require("../../services/reports.service");
const LayerService = require("../../services/layers.service");
const Router = require("koa-router");

const router = new Router({
  prefix: "/users/delete"
});

const deleteReports = async templates => {
  // delete all user answers
  await ReportService.deleteAllAnswersForUser();
  // once answers are deleted, need to get all templates for user
  templates.forEach(async template => {
    if (!template.attributes.public) {
      // if the template isn't a public template
      // check if template is used for any report answers
      const answers = await ReportService.getTemplateAnswers(template.id);
      if (answers && answers.length === 0) {
        // delete template if not being used
        ReportService.deleteTemplate(template.id);
      }
    }
  });
};

class UserRouter {
  static async delete(ctx) {
    const userId = ctx.request.query.loggedUser.id;
    const { userTeams, areas, templates } = ctx.request.query;

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
    deleteReports(templates);

    // remove all user's layers
    LayerService.deleteAllLayers();

    // remove user from their teams (don't just leave team)
    userTeams.forEach(team => {
      // delete each team-user relation instance
      const userTeamRelation = team.attributes.members.find(member => member.userId.toString === userId);
      if (userTeamRelation) TeamService.deleteTeamUserRelation(userTeamRelation.id);
    });

    ctx.status = 204;
  }

  static async deletePreflight(ctx) {
    //console.log("PREFLIGHT")
    const { userTeams, areas, templates } = ctx.request.query;
    const response = {
      userTeams: userTeams.length || 0,
      areas: areas.length || 0,
      templates: templates.length || 0
    };
    ctx.status = 200;
    ctx.body = { data: response };
  }
}

const getUserData = async (ctx, next) => {
  const user = JSON.parse(ctx.request.query.loggedUser);
  const userTeams = await TeamService.getUserTeams(user.id);
  //console.log("USER TEAMS", userTeams)
  const areas = await AreaService.getAreas();
  //console.log("AREAS", areas)
  const templates = await ReportService.getAllTemplates();
  //console.log("TEMPLATES", templates)

  ctx.request.query.userTeams = userTeams || [];
  ctx.request.query.areas = areas || [];
  ctx.request.query.templates = templates || [];

  await next();
};

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

router.get("/deletePreflight", isAuthenticatedMiddleware, getUserData, UserRouter.deletePreflight);
router.delete("/", isAuthenticatedMiddleware, getUserData, UserRouter.delete);

module.exports = router;
