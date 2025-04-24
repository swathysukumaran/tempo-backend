"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUser = exports.deleteUser = void 0;
const users_1 = require("../db/users");
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedUser = await (0, users_1.deleteUserById)(id);
        res.json(deletedUser);
        return;
    }
    catch (error) {
        console.log(error);
        res.sendStatus(400);
        return;
    }
};
exports.deleteUser = deleteUser;
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { username } = req.body;
        if (!username) {
            res.status(400);
            return;
        }
        const user = await (0, users_1.getUserById)(id);
        user.username = username;
        await user.save();
        res.sendStatus(200).json(user).end();
        return;
    }
    catch (error) {
        console.log(error);
        res.sendStatus(400);
        return;
    }
};
exports.updateUser = updateUser;
