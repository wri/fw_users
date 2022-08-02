const axios = require("axios");
const config = require("config");
const logger = require("logger");
const loggedInUserService = require("./LoggedInUserService");

class LayerService {
  static async deleteAllLayers() {
    try {
      const baseURL = config.get("layersAPI.url");
      const response = await axios.default({
        baseURL,
        url: `/deleteAllUserLayers`,
        method: "DELETE",
        headers: {
          authorization: loggedInUserService.token
        }
      });
      logger.info("Layers deleted with status code", response.status);
    } catch (e) {
      logger.info("Failed to delete layers");
    }
    return Promise.resolve();
  }
}

module.exports = LayerService;
