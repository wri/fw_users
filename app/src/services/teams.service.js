const axios = require("axios");
const config = require("config");
const logger = require("logger");
const loggedInUserService = require("./LoggedInUserService");

class TeamService {

  static async checkUserAdmin(userId) {

    let admin = false;
    const userTeams = await this.getUserTeams(userId);
    userTeams.forEach(team => {
      if(team.attributes.userRole === "administrator") admin = true;
    });
    return admin;

  }

  static async getUserTeams(user) {
    let teams = [];
    try {
      const baseURL = config.get("v3teamsAPI.url");
      const response = await axios.default({
        baseURL,
        url: `/teams/user/${user.toString()}`,
        method: "get",
        headers: {
          authorization: loggedInUserService.token
        }
      });
      teams = response.data;
    } catch (e) {
      logger.info("Failed to fetch teams", e);
    }
    if (teams.length === 0) {
      logger.info("User does not belong to a team.");
    }
    return teams.data;
  }

  static async getTeamUsers(teamId) {
    let teams = [];

    try {
      const baseURL = config.get("v3teamsAPI.url");
      const response = await axios.default({
        baseURL,
        url: `/teams/${teamId}/users`,
        method: "GET",
        headers: {
          authorization: loggedInUserService.token
        }
      });
      teams = response.data;
    } catch (e) {
      logger.info("Failed to fetch users");
    }
    if (teams.length === 0) {
      logger.info("No users are on this team.");
    }
    return teams.data;
  }
}

module.exports = TeamService;
