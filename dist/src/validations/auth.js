"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.registerSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.registerSchema = joi_1.default.object({
    username: joi_1.default.string().pattern(/^\S+$/).min(3).required().messages({
        "string.pattern.base": "username is not allowed to contain spaces",
        "string.empty": "username is required",
        "string.min": "username must be at least 3 characters long",
    }),
    name: joi_1.default.string().min(3).required().messages({
        "string.empty": "name is required",
        "string.min": "name must be at least 3 characters long",
    }),
    email: joi_1.default.string().email().required().messages({
        "string.empty": "email is required",
        "string.email": "email is not valid",
    }),
    password: joi_1.default.string().min(6).required().messages({
        "string.empty": "password is required",
        "string.min": "password must be at least 6 characters long",
    }),
});
exports.loginSchema = joi_1.default.object({
    identifier: joi_1.default.string().required().messages({
        "string.empty": "username or email is required",
    }),
    password: joi_1.default.string().required().messages({
        "string.empty": "password is required",
    }),
});
