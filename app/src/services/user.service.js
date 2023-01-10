const axios = require("axios");
const config = require("config");
const logger = require("logger");
const loggedInUserService = require("./LoggedInUserService");

class UserService {
  static async getUserName(userId) {
    try {
      logger.info("Getting user name");
      const baseURL = config.get("auth.url");
      const response = await axios.default({
        baseURL,
        url: `/v1/user/${userId.toString()}`,
        method: "get",
        headers: {
          authorization: loggedInUserService.token
        }
      });
      const user = response.data
      return user && `${user.data.attributes.firstName} ${user.data.attributes.lastName}`;
    } catch (e) {
      logger.info("Failed to fetch username", e);
    }
  }
}

module.exports = UserService;
