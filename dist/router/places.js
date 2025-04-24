"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const places_1 = require("../controllers/places");
exports.default = (router) => {
    router.post('/lookup-place', places_1.lookupPlace);
};
