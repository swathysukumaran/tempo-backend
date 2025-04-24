"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const compression_1 = __importDefault(require("compression"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const router_1 = __importDefault(require("./router"));
const speech_1 = require("@google-cloud/speech");
require('dotenv').config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use((0, compression_1.default)());
app.use((0, cookie_parser_1.default)());
const client = new speech_1.SpeechClient();
const server = http_1.default.createServer(app);
server.listen(8081, () => {
    console.log('Server is running on http://localhost:8081/');
});
const MONGO_URL = "mongodb+srv://swathysukumaran:g4pGjXwj22IlponE@cluster0.95gfw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose_1.default.Promise = Promise;
mongoose_1.default.connect(MONGO_URL);
mongoose_1.default.connection.on('error', (error) => { console.log(error); });
app.use(body_parser_1.default.json({ limit: '50mb' }));
app.use(express_1.default.json({ limit: '50mb' }));
// Increase URL-encoded payload size limit
app.use(body_parser_1.default.urlencoded({
    limit: '50mb',
    extended: true
}));
app.use('/', (0, router_1.default)());
app.use((req, res) => {
    console.log('🔥 Unmatched route:', req.method, req.path);
    res.status(404).json({ error: 'Route not found' });
});
