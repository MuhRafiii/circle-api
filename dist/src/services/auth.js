"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
const bcrypt_1 = __importDefault(require("bcrypt"));
const client_1 = require("../prisma/client");
const jwt_1 = require("../utils/jwt");
async function register(username, name, email, password) {
    const hashedPassword = await bcrypt_1.default.hash(password, 10);
    const user = await client_1.prisma.user.create({
        data: {
            username: username.toLowerCase(),
            full_name: name,
            email: email.toLowerCase(),
            password: hashedPassword,
        },
    });
    const token = (0, jwt_1.signToken)({
        id: user.id,
        username: user.username,
        name: user.full_name,
    });
    return {
        user_id: user.id,
        username,
        name: user.full_name,
        email,
        avatar: user.photo_profile,
        bio: user.bio,
        following: 0,
        followers: 0,
        token,
    };
}
async function login(identifier, password) {
    const user = await client_1.prisma.user.findFirst({
        where: {
            OR: [
                { username: identifier.toLowerCase().trim() },
                { email: identifier.toLowerCase().trim() },
            ],
        },
        include: {
            _count: {
                select: {
                    following: true,
                    followers: true,
                },
            },
        },
    });
    if (user) {
        const isMatch = await bcrypt_1.default.compare(password, user.password);
        if (!isMatch)
            throw { status: 401, message: "Invalid username or password" };
    }
    else {
        throw { status: 401, message: "Invalid username or password" };
    }
    const token = (0, jwt_1.signToken)({
        id: user.id,
        username: user.username,
        name: user.full_name,
    });
    return {
        user_id: user.id,
        username: user.username,
        name: user.full_name,
        email: user.email,
        avatar: user.photo_profile,
        bio: user.bio,
        following: user._count.following,
        followers: user._count.followers,
        token,
    };
}
