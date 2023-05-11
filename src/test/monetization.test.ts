import request from "supertest";
import { app } from "../app";

const githubToken = process.env.GITHUB_TOKEN;

describe("POST /monetization/cost", () => {
    it("should be able to retrieve the cost of a repository", (done) => {
        const repo = "https://github.com/i-voted-for-trump/is-even";
        request(app)
            .post("/api/monetization/cost")
            .send({
                url: repo,
                token: githubToken,
            })
            .set("Accept", "application/json")
            .end((err, res) => {
                const json = res.body;

                expect(res.status).toBe(200);
                expect(json.status).toBe("ok");
                expect(json.cost).toBeGreaterThan(0);
                expect(json.hashes).toHaveLength(8);
                done();
            });
    });

    it("should return an error if the repository does not exist", (done) => {
        const repo = "https://www.youtube.com/watch?v=keU3J0HHQ4s";
        request(app)
            .post("/api/monetization/cost")
            .send({
                url: repo,
                token: githubToken,
            })
            .set("Accept", "application/json")
            .end((err, res) => {
                const json = res.body;

                expect(res.status).toBe(200);
                expect(json.status).toBe("error");
                expect(json.error).toBe("Cannot find repository.");
                done();
            });
    });

    it("should return an error if an invalid token is provided", (done) => {
        const repo = "https://github.com/i-voted-for-trump/is-even";

        request(app)
            .post("/api/monetization/cost")
            .send({
                url: repo,
                token: "invalid",
            })
            .set("Accept", "application/json")
            .end((err, res) => {
                const json = res.body;

                expect(res.status).toBe(200);
                expect(json.status).toBe("error");
                done();
            });
    });
});

describe("POST /monetization/startSession", () => {
    it("should be able to start a new session", (done) => {
        const hashes = [
            "0x000000",
            "0x000001",
            "0x000002",
            "0x000003",
            "0x000004",
            "0x000005",
        ];

        request(app)
            .post("/api/monetization/startSession")
            .send({
                hashes,
            })
            .set("Accept", "application/json")
            .end((err, res) => {
                const json = res.body;

                expect(res.status).toBe(200);
                expect(json.status).toBe("ok");
                expect(json.sessId).toBeDefined();
                expect(json.secret).toBeDefined();
                done();
            });
    });
});
