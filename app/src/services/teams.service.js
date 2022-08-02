const axios = require("axios");
const config = require("config");
const logger = require("logger");
const loggedInUserService = require("./LoggedInUserService");

class TeamService {

  static async checkUserAdmin(userTeams) {

    let admin = false;
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
    return teams && teams.data;
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

  static async deleteTeamUserRelation({teamId, relationId}) {
    try {
      const baseURL = config.get("v3teamsAPI.url");
      const response = await axios.default({
        baseURL,
        url: `/teams/${teamId}/users/${relationId}`,
        method: "DELETE",
        headers: {
          authorization: loggedInUserService.token
        }
      });
      logger.info("User removed from team with status",response.status);
    } catch (e) {
      logger.info("Failed to delete user from team");
    }
    return Promise.resolve();
  }
}

module.exports = TeamService;
