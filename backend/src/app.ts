import express from "express";
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const statusRouter = express.Router();
app.use('/api/v1', statusRouter);

io.set('origins', '*:*');
io.on('connection', async (socket: any) => {
	console.log("Client Successfully Connected");
	socket.on('create', async (room: string) => {
		socket.join(room);
		socket.broadcast.to(room).emit('new_connection', 'new_connection');
		socket.on('send', async(text: string) => {
			io.sockets.in(room).emit('receive', text);
		});
		socket.on('send_candidate', async(candidate: any) => {
			socket.broadcast.to(room).emit('remote_candidate', candidate);
		});
		socket.on('send_description', async(description) => {
			socket.broadcast.to(room).emit('remote_description', description);
		});
		socket.on('disconnect', async () => {
			socket.disconnect(0);
			io.sockets.in(room).emit('counter', io.sockets.adapter.rooms[room].length);
		});

		socket.on('call_count', async(description) => {
			io.sockets.in(room).emit('counter', io.sockets.adapter.rooms[room].length);
		});
		io.sockets.in(room).emit('counter', io.sockets.adapter.rooms[room].length);
	});
})

server.listen(5000, "0.0.0.0", () => {
	console.log("Backend Server is running on http://0.0.0.0:5000");
})