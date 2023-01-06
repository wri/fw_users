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
      logger.info("Answers deleted with status code", response.status);
    } catch (e) {
      logger.info("Failed to delete answers");
    }
    return Promise.resolve();
  }

  static async getAllTemplates(userId) {
    try {
      const baseURL = config.get("formsAPI.url");
      const response = await axios.default({
        baseURL,
        url: `/latest/${userId}`,
        method: "GET",
        headers: {
          authorization: loggedInUserService.token
        }
      });
      const templates = response.data;
      logger.info(`Got templates ${{ ...templates }}`);
      return templates && templates.data;
    } catch (e) {
      logger.info("Failed to get templates");
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
      logger.info(`Got answers ${{ ...templates }}`);
      return answers && answers.data;
    } catch (e) {
      logger.info("Failed to get answers");
    }
  }

}

module.exports = ReportService;
