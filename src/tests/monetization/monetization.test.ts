/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import request from "supertest";
import { app } from "../../app";

// const githubToken = process.env.GITHUB_TOKEN;
// if (!githubToken) {
//     throw new Error("GITHUB_TOKEN not set in .env.test.local");
// }

describe("POST /monetization/cost", () => {
    it("should be able to retrieve the cost of a repository", (done) => {
        const repo = "https://github.com/i-voted-for-trump/is-even";
        request(app)
            .post("/api/monetization/cost")
            .send({
                url: repo,
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
            })
            .set("Accept", "application/json")
            .end((err, res) => {
                const json = res.body;

                console.log(json);

                expect(res.status).toBe(200);
                expect(json.status).toBe("error");
                expect(json.error).toBe("Cannot find repository.");
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

    it("should return an error if no hashes are provided", (done) => {
        request(app)
            .post("/api/monetization/startSession")
            .send({})
            .set("Accept", "application/json")
            .end((err, res) => {
                expect(res.status).toBe(400);
                done();
            });
    });
});

describe("GET /monetization/getData", () => {
    it("should be able to retrieve data from a session", (done) => {
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

                const sessId = json.sessId;
                const secret = json.secret;

                request(app)
                    .get("/api/monetization/getData")
                    .query({
                        sessId,
                        secret,
                    })
                    .set("Accept", "application/json")
                    .end((err, res) => {
                        const json = res.body;

                        expect(res.status).toBe(200);
                        expect(json.status).toBe("ok");
                        expect(json.fetch_status).toBe("idle");
                        expect(json.data).toBeUndefined();
                        expect(json.timestamp).toBeDefined();
                        done();
                    });
            });
    });

    it("should return an error if the incorrect secret is provided", (done) => {
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
                const sessId = res.body.sessId;

                request(app)
                    .get("/api/monetization/getData")
                    .query({
                        sessId,
                        secret: "invalid",
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

    it("should return an error if a non-existent session is provided", (done) => {
        request(app)
            .get("/api/monetization/getData")
            .query({
                sessId: "invalid",
                secret: "invalid",
            })
            .set("Accept", "application/json")
            .end((err, res) => {
                const json = res.body;

                expect(res.status).toBe(200);
                expect(json.status).toBe("error");
                done();
            });
    });

    it("should return an error if no query params are provided", (done) => {
        request(app)
            .get("/api/monetization/getData")
            .set("Accept", "application/json")
            .end((err, res) => {
                expect(res.status).toBe(400);
                done();
            });
    });
});
