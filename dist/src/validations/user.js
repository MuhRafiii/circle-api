"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfileSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.updateProfileSchema = joi_1.default.object({
    name: joi_1.default.string().min(3).max(100).messages({
        "string.empty": "name is required",
        "string.min": "name must be at least 3 characters long",
        "string.max": "name must be at most 100 characters long",
    }),
    bio: joi_1.default.string().allow(""),
    username: joi_1.default.string().min(3).max(30).messages({
        "string.empty": "username is required",
        "string.min": "username must be at least 3 characters long",
        "string.max": "username must be at most 30 characters long",
    }),
});
