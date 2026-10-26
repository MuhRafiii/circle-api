"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
const jwt_1 = require("../utils/jwt");
function authenticate(req, res, next) {
    var _a;
    let token = req.cookies.token;
    if (!token) {
        token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    }
    if (!token) {
        res
            .status(401)
            .json({ code: 401, status: "error", message: "Unauthorized" });
        return;
    }
    try {
        const decoded = (0, jwt_1.verifyToken)(token);
        req.user = decoded;
        next();
    }
    catch {
        res
            .status(401)
            .json({ code: 401, status: "error", message: "Invalid token" });
        return;
    }
}
