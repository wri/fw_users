const nock = require("nock");
const config = require("config");
//const { AreaTemplateRelationModel, AreaTeamRelationModel } = require("models");
//const { ObjectId } = require("mongoose").Types;

const mockGetUserFromToken = userProfile => {
  nock(config.get("auth.url"), { reqheaders: { authorization: "Bearer abcd" } })
    .get("/auth/user/me")
    .reply(200, userProfile);
};

module.exports = {
  mockGetUserFromToken
};
