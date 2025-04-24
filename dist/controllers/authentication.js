"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const users_1 = require("../db/users");
const helpers_1 = require("../helpers");
const register = async (req, res) => {
    try {
        const { email, password, username } = req.body;
        if (!email || !password || !username) {
            res.status(400).json({ error: 'Missing required fields' });
            return; // Ensure no further execution
        }
        const existingUser = await (0, users_1.getUserByEmail)(email);
        if (existingUser) {
            res.status(400).json({ error: 'User already exists' });
            return;
        }
        const salt = (0, helpers_1.random)();
        const user = await (0, users_1.createUser)({
            email,
            username,
            authentication: {
                salt,
                password: (0, helpers_1.authentication)(salt, password),
            }
        });
        const sessionSalt = (0, helpers_1.random)();
        user.authentication.sessionToken = (0, helpers_1.authentication)(sessionSalt, user._id.toString());
        await user.save();
        res.cookie('TEMPO-AUTH', user.authentication.sessionToken, {
            domain: 'localhost',
            path: '/',
        });
        res.status(201).json(user); // Send the response
        return;
    }
    catch (error) {
        console.log(error);
        console.error('Registration Error:', error);
        res.status(500).json({ error: 'Internal Server Error' }); // Handle errors
        return;
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ error: "Email and password are required." });
            ;
            return;
        }
        const user = await (0, users_1.getUserByEmail)(email).select('+authentication.salt +authentication.password');
        if (!user) {
            res.status(400).json({ error: "User not found." });
            ;
            return;
        }
        const expectedHash = (0, helpers_1.authentication)(user.authentication.salt, password);
        if (expectedHash != user.authentication.password) {
            res.status(403).json({ error: "Invalid credentials." });
            ;
            return;
        }
        const salt = (0, helpers_1.random)();
        user.authentication.sessionToken = (0, helpers_1.authentication)(salt, user._id.toString());
        console.log(user.authentication.sessionToken);
        await user.save();
        res.cookie('TEMPO-AUTH', user.authentication.sessionToken, { domain: 'localhost', path: '/' });
        res.status(200).json(user);
        return;
    }
    catch (error) {
        console.error('Login Error:', error);
        res.status(400);
        return;
    }
};
exports.login = login;
