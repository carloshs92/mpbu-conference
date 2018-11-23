import * as io from 'socket.io-client';

class SocketHandler {
    public static getInstance() {
        if (!SocketHandler.instance) {
            SocketHandler.instance = new SocketHandler();
        }
        return SocketHandler.instance;
    }

    private static instance: SocketHandler;
    private socket: any;

    private constructor() {
        this.socket = io('http://localhost:5000/');
    }

    public connect(room: string) {
        this.socket.emit('create', room);
    }

    public send(text: string) {
        this.socket.emit('send', text);
    }

    public receive(cb: any) {
        this.socket.on('receive', (message: string) => {
            cb(message);
        });
    }
}

export default SocketHandler;
