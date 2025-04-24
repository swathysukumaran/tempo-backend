"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const speechController_1 = require("../controllers/speechController");
exports.default = (router) => {
    router.post('/transcribe', speechController_1.transcribeAudio);
};
