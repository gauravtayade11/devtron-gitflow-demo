const request = require("supertest");
const app = require("app.js");

describe("GET /", () => {
  it("should return Hello message", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
    expect(res.text).toMatch(/Hello from Devtron/);
  });
});

describe("GET /contact", () => {
  it("should return contact details", async () => {
    const res = await request(app).get("/contact");
    expect(res.statusCode).toBe(200);
    expect(res.body.email).toBeDefined();
  });
});
