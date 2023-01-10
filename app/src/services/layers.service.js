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
    } catch (e) {
      logger.info("Failed to delete layers");
    }
    return response.data && response.data.data;
  }
}

module.exports = LayerService;
