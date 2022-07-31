const axios = require("axios");
const config = require("config");
const logger = require("logger");
const loggedInUserService = require("./LoggedInUserService");

class ReportService {

  static async deleteAllAnswersForUser() {

    try {
      const baseURL = config.get("formsAPI.url");
      const response = await axios.default({
        baseURL,
        url: `/v3/reports/deleteAllAnswersForUser`,
        method: "DELETE",
        headers: {
          authorization: loggedInUserService.token
        }
      });
      logger.info("Answers deleted with status code", response.status);
    } catch (e) {
      logger.info("Failed to delete answers");
    }
    return Promise.resolve();
  }

  static async getAllTemplates() {

    try {
      const baseURL = config.get("formsAPI.url");
      const response = await axios.default({
        baseURL,
        url: `/v1/reports/`,
        method: "GET",
        headers: {
          authorization: loggedInUserService.token
        }
      });
      const templates = response.data
      logger.info(`Got templates ${templates}`)
      return templates && templates.data
    } catch (e) {
      logger.info("Failed to get templates");
    }
  }

  static async getTemplateAnswers(templateId) {

    try {
      const baseURL = config.get("formsAPI.url");
      const response = await axios.default({
        baseURL,
        url: `/v1/reports/${templateId}/answers`,
        method: "GET",
        headers: {
          authorization: loggedInUserService.token
        }
      });
      const answers = response.data
      logger.info(`Got template answers ${answers}`)
      return answers && answers.data
    } catch (e) {
      logger.info("Failed to get answers");
    }
  }

  static async deleteTemplate(templateId) {

    try {
      const baseURL = config.get("formsAPI.url");
      const response = await axios.default({
        baseURL,
        url: `/v3/reports/${templateId}`,
        method: "DELETE",
        headers: {
          authorization: loggedInUserService.token
        }
      });
      logger.info(`Deleted template ${templateId} with status code ${response.status}`)
      return Promise.resolve();
    } catch (e) {
      logger.info("Failed to get answers");
    }
  }
}

module.exports = ReportService;
