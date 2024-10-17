const request = require("supertest");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const app = require("../app"); // Your Express app

// Load environment variables from .env file
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

describe("User API Tests", () => {
  // Hook to run before all tests to establish DB connection
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_DB, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });
  });

  // Hook to run after all tests to disconnect DB
  afterAll(async () => {
    await mongoose.disconnect();
  });

  it("should register a new user", async () => {
    const res = await request(app).post("/api/v1/users/register").send({
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("token");
  });

  it("should login a user", async () => {
    const res = await request(app).post("/api/v1/users/login").send({
      email: "test@example.com",
      password: "password123",
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("token");
  });

  it("should get user profile", async () => {
    const loginRes = await request(app).post("/api/v1/users/login").send({
      email: "test@example.com",
      password: "password123",
    });
    const token = loginRes.body.token;

    const res = await request(app)
      .get("/api/v1/users/profile")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.user).toHaveProperty("email", "test@example.com");
  });
});
