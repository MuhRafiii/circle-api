"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleRegister = handleRegister;
exports.handleLogin = handleLogin;
const auth_1 = require("../services/auth");
const auth_2 = require("../validations/auth");
async function handleRegister(req, res, next) {
    try {
        const { error } = auth_2.registerSchema.validate(req.body);
        if (error) {
            return next(error);
        }
        const { username, name, email, password } = req.body;
        const data = await (0, auth_1.register)(username, name, email, password);
        res.cookie("token", data.token, {
            httpOnly: true,
            sameSite: "none",
            secure: true,
            maxAge: 1000 * 60 * 60 * 24,
        });
        res.status(201).json({
            code: 201,
            status: "success",
            message: "Registrasi berhasil. Akun berhasil dibuat.",
            data,
        });
    }
    catch (err) {
        next(err);
    }
}
async function handleLogin(req, res, next) {
    try {
        const { error } = auth_2.loginSchema.validate(req.body);
        if (error) {
            return next(error);
        }
        const { identifier, password } = req.body;
        const data = await (0, auth_1.login)(identifier, password);
        if (!data) {
            const errObj = { status: 401, message: "Invalid username or password" };
            return next(errObj);
        }
        res.cookie("token", data.token, {
            httpOnly: true,
            sameSite: "none",
            secure: true,
            maxAge: 1000 * 60 * 60 * 24,
        });
        res.status(200).json({
            code: 200,
            status: "success",
            message: "Login successful.",
            data,
        });
    }
    catch (err) {
        next(err);
    }
}
