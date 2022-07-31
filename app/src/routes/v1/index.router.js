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
    // **** check that user isn't part of any teams ****
    if(await TeamService.checkUserAdmin) ctx.throw(400,"Cannot delete a team administrator. Please reassign all team administrators before deleting account.");
    
    // **** remove all area links to teams and templates ****
    const areas = await AreaService.getAreas();
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
    const templates = await ReportService.getAllTemplates();
    templates.forEach(template => {
      if(!template.attributes.public) { // if the template isn't a public template
        // check if template is used for any report answers
        const answers = await ReportService.getTemplateAnswers(template.id);
        if(answers.length === 0) { // delete template if not being used
          ReportService.deleteTemplate(template.id);
        }
      }
    });

    // remove all user's layers
    LayerService.deleteAllLayers();

    // remove user from their teams (don't just leave team)


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