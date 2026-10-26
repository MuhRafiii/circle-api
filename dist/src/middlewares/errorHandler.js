"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const client_1 = require("@prisma/client");
const joi_1 = __importDefault(require("joi"));
function errorHandler(err, req, res, next) {
    var _a, _b, _c;
    let statusCode = 500;
    let message = "Internal Server Error";
    if (err instanceof joi_1.default.ValidationError) {
        statusCode = 400;
        message = (_b = (_a = err.details[0]) === null || _a === void 0 ? void 0 : _a.message) !== null && _b !== void 0 ? _b : "Invalid input";
    }
    else if (err instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        const target = (_c = err.meta) === null || _c === void 0 ? void 0 : _c.target;
        const fields = Array.isArray(target) ? target.join(", ") : "Data";
        if (err.code === "P2002") {
            statusCode = 409;
            message = `${fields} already used`;
        }
        else if (err.code === "P2025") {
            statusCode = 404;
            message = `${fields} is not found`;
        }
    }
    else if (typeof (err === null || err === void 0 ? void 0 : err.status) === "number" && err.status < 500) {
        statusCode = err.status;
        message = err.message;
    }
    if (statusCode >= 500) {
        console.error(err);
    }
    res.status(statusCode).json({
        code: statusCode,
        status: statusCode === 401 ? "unauthorized" : "error",
        message,
    });
}
