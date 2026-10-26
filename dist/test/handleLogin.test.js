"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_1 = __importDefault(require("express"));
const supertest_1 = __importDefault(require("supertest"));
const auth_1 = require("../src/controllers/auth");
const auth_2 = require("../src/services/auth");
const auth_3 = require("../src/validations/auth");
jest.mock("../src/services/auth");
jest.mock("../src/validations/auth");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.post("/login", auth_1.handleLogin);
describe("handleLogin Controller", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it("should return 400 if validation fails", async () => {
        auth_3.loginSchema.validate.mockReturnValueOnce({
            error: { message: "identifier is required" },
        });
        const res = await (0, supertest_1.default)(app)
            .post("/login")
            .send({ identifier: "", password: "" });
        expect(res.status).toBe(400);
        expect(res.body.status).toBe("error");
        expect(res.body.error).toContain("Invalid login");
    });
    it("should return 200 and set cookie when login succeeds", async () => {
        auth_3.loginSchema.validate.mockReturnValueOnce({});
        auth_2.login.mockResolvedValueOnce({
            token: "fake-token",
            username: "testuser",
            name: "Test User",
            email: "test@example.com",
        });
        const res = await (0, supertest_1.default)(app)
            .post("/login")
            .send({ identifier: "test@example.com", password: "123456" });
        expect(res.status).toBe(200);
        expect(res.body.status).toBe("success");
        expect(res.body.message).toBe("Login successful.");
        expect(res.body.data.token).toBe("fake-token");
        expect(res.headers["set-cookie"]).toBeDefined();
    });
    it("should return 400 if login service throws error", async () => {
        auth_3.loginSchema.validate.mockReturnValueOnce({});
        auth_2.login.mockRejectedValueOnce(new Error("Invalid username or password"));
        const res = await (0, supertest_1.default)(app)
            .post("/login")
            .send({ identifier: "wrong@example.com", password: "wrongpass" });
        expect(res.status).toBe(400);
        expect(res.body.status).toBe("error");
        expect(res.body.message).toBe("Invalid username or password");
    });
});
