const config = require("config");
const logger = require("../logger");
const axios = require("axios");
const loggedInUserService = require("./LoggedInUserService");

class AreaService {
  static async getAreas() {
    logger.info(`Getting areas`);
    try {
      const baseURL = config.get("areasAPI.url");
      const response = await axios.default({
        baseURL,
        url: `/user`,
        method: "GET",
        headers: {
          authorization: loggedInUserService.token
        }
      });
      const areas = response.data;
      logger.info("Got areas");
      return areas && areas.data;
    } catch (e) {
      logger.error("Error while fetching areas", e);
      return null; // log the error but still return
    }
  }

  static async deleteTemplateRelations(areaId) {
    logger.info(`Deleting template relations for area ${areaId}`);
    try {
      const baseURL = config.get("areasAPI.url");
      const response = await axios.default({
        baseURL,
        url: `/templates/deleteAllForArea/${areaId}`,
        method: "DELETE",
        headers: {
          authorization: loggedInUserService.token
        }
      });
      logger.info(`Deleted template relations for area ${areaId} with status code ${response.status}`);
      return Promise.resolve();
    } catch (e) {
      logger.error(`Error while deleting template relations for area ${areaId}`, e);
      return null; // log the error but still return
    }
  }

  static async deleteTeamRelations(areaId) {
    logger.info(`Deleting team relations for area ${areaId}`);
    try {
      const baseURL = config.get("areasAPI.url");
      const response = await axios.default({
        baseURL,
        url: `/teams/deleteAllForArea/${areaId}`,
        method: "DELETE",
        headers: {
          authorization: loggedInUserService.token
        }
      });
      logger.info(`Deleted team relations for area ${areaId} with status code ${response.status}`);
      return Promise.resolve();
    } catch (e) {
      logger.error(`Error while deleting team relations for area ${areaId}`, e);
      return null; // log the error but still return
    }
  }
}
module.exports = AreaService;
