const axios = require("axios");
const config = require("config");
const logger = require("logger");
const loggedInUserService = require("./LoggedInUserService");

class ReportService {
  static async deleteAll(userId) {
    try {
      const baseURL = config.get("formsAPI.url");
      const response = await axios.default({
        baseURL,
        url: `/allUser/${userId}`,
        method: "DELETE",
        headers: {
          authorization: loggedInUserService.token
        }
      });
      return response.data
    } catch (e) {
      logger.info("Failed to delete answers");
    }
  }

  static async getAllTemplates(userId) {
    try {
      const baseURL = config.get("formsAPI.url");
      const response = await axios.default({
        baseURL,
        url: `/latestByUserId/${userId}`,
        method: "GET",
        headers: {
          authorization: loggedInUserService.token
        }
      });
      const templates = response.data;
      logger.info(`Got templates`);
      return templates && templates.data;
    } catch (e) {
      logger.info("Failed to get templates", e);
    }
  }

  static async getAllAnswers(userId) {
    try {
      const baseURL = config.get("formsAPI.url");
      const response = await axios.default({
        baseURL,
        url: `/allUserAnswers/${userId}`,
        method: "GET",
        headers: {
          authorization: loggedInUserService.token
        }
      });
      const answers = response.data;
      logger.info(`Got answers`);
      return answers && answers.data;
    } catch (e) {
      logger.info("Failed to get answers",e);
    }
  }

}

module.exports = ReportService;
