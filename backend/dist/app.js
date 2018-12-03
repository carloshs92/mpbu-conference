"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = express_1.default();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const statusRouter = express_1.default.Router();
app.use('/api/v1', statusRouter);
io.set('origins', '*:*');
io.on('connection', (socket) => __awaiter(this, void 0, void 0, function* () {
    console.log("Client Successfully Connected");
    socket.on('create', (room) => __awaiter(this, void 0, void 0, function* () {
        socket.join(room);
        socket.broadcast.to(room).emit('new_connection', 'new_connection');
        socket.on('send', (text) => __awaiter(this, void 0, void 0, function* () {
            io.sockets.in(room).emit('receive', text);
        }));
        socket.on('send_candidate', (candidate) => __awaiter(this, void 0, void 0, function* () {
            socket.broadcast.to(room).emit('remote_candidate', candidate);
        }));
        socket.on('send_description', (description) => __awaiter(this, void 0, void 0, function* () {
            socket.broadcast.to(room).emit('remote_description', description);
        }));
        socket.on('disconnect', () => __awaiter(this, void 0, void 0, function* () {
            socket.disconnect(0);
            io.sockets.in(room).emit('counter', io.sockets.adapter.rooms[room].length);
        }));
        socket.on('call_count', (description) => __awaiter(this, void 0, void 0, function* () {
            io.sockets.in(room).emit('counter', io.sockets.adapter.rooms[room].length);
        }));
        io.sockets.in(room).emit('counter', io.sockets.adapter.rooms[room].length);
    }));
}));
server.listen(5000, "0.0.0.0", () => {
    console.log("Backend Server is running on http://0.0.0.0:5000");
});
//# sourceMappingURL=app.js.map