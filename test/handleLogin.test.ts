import cookieParser from "cookie-parser";
import express, { Application } from "express";
import request from "supertest";
import { handleLogin } from "../src/controllers/auth";
import { login } from "../src/services/auth";
import { loginSchema } from "../src/validations/auth";

jest.mock("../src/services/auth");
jest.mock("../src/validations/auth");

const app: Application = express();
app.use(express.json());
app.use(cookieParser());
app.post("/login", handleLogin);

describe("handleLogin Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 400 if validation fails", async () => {
    (loginSchema.validate as jest.Mock).mockReturnValueOnce({
      error: { message: "identifier is required" },
    });

    const res = await request(app)
      .post("/login")
      .send({ identifier: "", password: "" });

    expect(res.status).toBe(400);
    expect(res.body.status).toBe("error");
    expect(res.body.error).toContain("Invalid login");
  });

  it("should return 200 and set cookie when login succeeds", async () => {
    (loginSchema.validate as jest.Mock).mockReturnValueOnce({});
    (login as jest.Mock).mockResolvedValueOnce({
      token: "fake-token",
      username: "testuser",
      name: "Test User",
      email: "test@example.com",
    });

    const res = await request(app)
      .post("/login")
      .send({ identifier: "test@example.com", password: "123456" });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("success");
    expect(res.body.message).toBe("Login successful.");
    expect(res.body.data.token).toBe("fake-token");
    expect(res.headers["set-cookie"]).toBeDefined();
  });

  it("should return 400 if login service throws error", async () => {
    (loginSchema.validate as jest.Mock).mockReturnValueOnce({});
    (login as jest.Mock).mockRejectedValueOnce(
      new Error("Invalid username or password")
    );

    const res = await request(app)
      .post("/login")
      .send({ identifier: "wrong@example.com", password: "wrongpass" });

    expect(res.status).toBe(400);
    expect(res.body.status).toBe("error");
    expect(res.body.message).toBe("Invalid username or password");
  });
});
