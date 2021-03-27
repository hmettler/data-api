const request = require("supertest");
const { app, sequelize } = require("./app");

test('test', () => {
    expect(1).toBe(1);
});

describe("GET /data", async () => {
    beforeAll(async () => {
        await sequelize.authenticate();
        await sequelize.sync({ alter: true });
    });

    it("responds with json with key", async (done) => {
        request(app)
            .get("/data?key=12345")
            .set("Accept", "application/json")
            .set("Content-Type", "application/json")
            .expect(200)
            .expect('Content-Type', /json/)
            .end((err, resp) => {
                if(err) return done(err);
                expect(resp.text).toEqual("[]");
                return done();
            });
    });

    it("responds with 403 without key", async (done) => {
        request(app)
            .get("/data")
            .set("Accept", "application/json")
            .set("Content-Type", "application/json")
            .expect(403)
            //.expect('Content-Type', /json/)
            .end((err, resp) => {
                if(err) return done(err);
                expect(resp.text).toEqual("No or bad API Key");
                return done();
            });
    });

    it("responds with 403 with bad key", async (done) => {
        request(app)
            .get("/data?key=123")
            .set("Accept", "application/json")
            .set("Content-Type", "application/json")
            .expect(403)
            //.expect('Content-Type', /json/)
            .end((err, resp) => {
                if(err) return done(err);
                expect(resp.text).toEqual("No or bad API Key");
                return done();
            });
    });

    it("responds with json with key", async (done) => {
        request(app)
            .post("/data?key=12345")
            .set("Accept", "application/json")
            .set("Content-Type", "application/json")
            .set("hmac", "66bf0fdec8074b3dc62793bbde67ab8843572e57")
            .send({"serial":"123","name":"abc","temperature":10.8})
            .expect(201)
            .expect('Content-Type', /json/)
            .end((err, resp) => {
                if(err) return done(err);
                expect(resp.text).toMatch('"serial":"123","name":"abc","temperature":10.8')
                return done();
            });
    });
});