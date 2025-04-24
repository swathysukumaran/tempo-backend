"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authentication_1 = __importDefault(require("./authentication"));
const AI_1 = __importDefault(require("./AI"));
const users_1 = __importDefault(require("./users"));
const tripDetails_1 = __importDefault(require("./tripDetails"));

const speechRoutes_1 = __importDefault(require("./speechRoutes"));
const me_1 = __importDefault(require("./me"));
const places_1 = __importDefault(require("./places"));
const router = express_1.default.Router();
exports.default = () => {
    (0, authentication_1.default)(router);
    (0, AI_1.default)(router);
    (0, users_1.default)(router);
    (0, tripDetails_1.default)(router);


    (0, speechRoutes_1.default)(router);
    (0, me_1.default)(router);
    (0, places_1.default)(router);
    return router;
};
