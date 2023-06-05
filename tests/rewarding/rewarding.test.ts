import request from "supertest";
import { app } from "../../server";

describe("POST /rewarding/reward", () => {
    it("should return an error when no query params are provided", (done) => {
        request(app)
            .post("/api/rewarding/reward")
            .set("Accept", "application/json")
            .end((err, res) => {
                expect(res.status).toBe(400);
                done();
            });
    });

    it("should be able to retrieve proof", (done) => {
        const address = "0x181bC4c7ffB851D83ce9266A659FAA4BC207b90A";

        const hashes = ["0x000000", "0x000001", "0x000002"];

        request(app)
            .post("/api/rewarding/reward")
            .send({
                address,
                hashes,
            })
            .set("Accept", "application/json")
            .end((err, res) => {
                const json = res.body;

                expect(res.status).toBe(200);
                expect(json.status).toBe("ok");
                expect(json.proof).toBeDefined();
                done();
            });
    });
});
