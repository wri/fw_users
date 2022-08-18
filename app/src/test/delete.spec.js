const request = require("supertest");
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const server = require("app");
const nock = require("nock");
const config = require("config");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

describe("Delete Account", () => {
  beforeEach(async () => {
    if (process.env.NODE_ENV !== "test") {
      throw Error(
        `Running the test suite with NODE_ENV ${process.env.NODE_ENV} may result in permanent data loss. Please use NODE_ENV=test.`
      );
    }
  });

  afterEach(async () => {
    nock.cleanAll();
  });

  describe("GET /v1/users/deletePreflight", () => {
    beforeEach(async () => {
      nock(config.get("teamsAPI.url"))
        .persist()
        .get(`/teams/user/addaddaddaddaddaddaddadd`)
        .reply(200, {
          data: ["team1"]
        });
      nock(config.get("areasAPI.url"))
        .persist()
        .get(`/area`)
        .reply(200, {
          data: ["area1", "area2"]
        });
      nock(config.get("formsAPI.url"))
        .persist()
        .get(`/v1/reports`)
        .reply(200, {
          data: ["temp1", "temp2", "temp3"]
        });
    });

    it("should return 200 for happy case", async () => {
      const res = await request(server).get(`/v1/users/deletePreflight`);
      expect(res.status).toBe(200);
    });

    it("should return an object containing values", async () => {
      const res = await request(server).get(`/v1/users/deletePreflight`);
      expect(res.status).toBe(200);
      expect(res.body.data).toEqual(
        expect.objectContaining({
          userTeams: 1,
          areas: 2,
          templates: 3
        })
      );
    });
  });

  describe("DELETE /v1/users", () => {
    beforeEach(async () => {
      const team1 = new ObjectId(),
        area1 = new ObjectId(),
        template1 = new ObjectId(),
        answer1 = new ObjectId();

      nock(config.get("areasAPI.url"))
        .persist()
        .get(`/area`)
        .reply(200, {
          data: [{ id: area1 }]
        });
      nock(config.get("formsAPI.url"))
        .persist()
        .get(`/v1/reports`)
        .reply(200, {
          data: [
            {
              type: "reports",
              id: "a",
              attributes: {
                name: {
                  nl: "Test Template 1"
                },
                languages: ["nl"],
                defaultLanguage: "nl",
                user: "6242c57a880445001a46c499",
                answersCount: 0,
                questions: [
                  {
                    type: "text",
                    name: "question-1",
                    _id: "62b1e678b39515f15c774548",
                    conditions: [],
                    childQuestions: [],
                    order: 0,
                    required: false,
                    label: {
                      nl: "test"
                    }
                  }
                ],
                createdAt: "2022-06-21T15:40:39.999Z",
                public: false,
                status: "published"
              }
            }
          ]
        });
      nock(config.get("formsAPI.url")).persist().get(`/v1/reports/a/answers`).reply(200);
      nock(config.get("formsAPI.url")).persist().delete(`/v3/reports/deleteAllAnswersForUser`).reply(204);
      nock(config.get("formsAPI.url")).persist().delete(`/v3/reports/a`).reply(204);
      nock(config.get("areasAPI.url")).persist().delete(`/area/${area1}/templates`).reply(204);
      nock(config.get("areasAPI.url")).persist().delete(`/area/${area1}/teams`).reply(204);
      nock(config.get("layersAPI.url")).persist().delete(`/deleteAllUserLayers`).reply(204);
    });

    it("should return 200 for happy case", async () => {
      const team1 = new ObjectId();
      nock(config.get("teamsAPI.url"))
        .persist()
        .get(`/teams/user/addaddaddaddaddaddaddadd`)
        .reply(200, {
          data: [
            {
              type: "team",
              id: team1,
              attributes: {
                name: "test team",
                userRole: "monitor",
                createdAt: "2022-06-09T14:44:57.821Z",
                members: [
                  {
                    name: "Georga Test",
                    _id: "62a207697892d4004a06ab23",
                    teamId: team1,
                    userId: "addaddaddaddaddaddaddadd",
                    email: "cubegfw@gmail.com",
                    role: "monitor",
                    status: "confirmed",
                    __v: 0
                  }
                ],
                areas: []
              }
            }
          ]
        });
      const res = await request(server).delete(`/v1/users`);
      expect(res.status).toBe(204);
    });

    it("should return 400 if user is admin of a team", async () => {
      const team1 = new ObjectId();
      nock(config.get("teamsAPI.url"))
        .persist()
        .get(`/teams/user/addaddaddaddaddaddaddadd`)
        .reply(200, {
          data: [
            {
              type: "team",
              id: team1,
              attributes: {
                name: "test team",
                userRole: "administrator",
                createdAt: "2022-06-09T14:44:57.821Z",
                members: [
                  {
                    name: "Georga Test",
                    _id: "62a207697892d4004a06ab23",
                    teamId: team1,
                    userId: "addaddaddaddaddaddaddadd",
                    email: "cubegfw@gmail.com",
                    role: "monitor",
                    status: "confirmed",
                    __v: 0
                  }
                ],
                areas: []
              }
            }
          ]
        });
      const res = await request(server).delete(`/v1/users`);
      expect(res.status).toBe(400);
    });
  });
});
