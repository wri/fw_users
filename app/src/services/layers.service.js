const axios = require("axios");
const config = require("config");
const logger = require("logger");
const loggedInUserService = require("./LoggedInUserService");

class LayerService {

  static async getAllLayers(userId) {
    try {
      const baseURL = config.get("layersAPI.url");
      const response = await axios.default({
        baseURL,
        url: `/user/${userId}`,
        method: "GET",
        headers: {
          authorization: loggedInUserService.token
        }
      });
      logger.info("Got layers", response.data);
      return response.data && response.data.data;
    } catch (e) {
      logger.info("Failed to get layers", e);
    }
  }

  static async deleteAllLayers(userId) {
    try {
      const baseURL = config.get("layersAPI.url");
      const response = await axios.default({
        baseURL,
        url: `/user/${userId}`,
        method: "DELETE",
        headers: {
          authorization: loggedInUserService.token
        }
      });
      logger.info("Layers deleted with status code", response.status);
      return response.data && response.data.data.layersDeleted;
    } catch (e) {
      logger.info("Failed to delete layers", e);
    }
  }
}

module.exports = LayerService;
