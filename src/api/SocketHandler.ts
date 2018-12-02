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
        this.socket = io('http://0.0.0.0:5000/');
    }

    public send(text: string) {
        this.socket.emit('send', text);
    }

    public receive(cb: any) {
        this.socket.on('receive', (message: string) => {
            cb(message);
        });
    }

    // Videollamada
    public connect(room: string) {
        this.socket.emit('create', room);
    }

    public count(cb: any) {
        this.socket.on('counter', (total: string) => {
            cb(total);
        });
    }

    public callCount() {
        this.socket.emit('call_count');
    }

    public sendCandidate(candidate: RTCIceCandidate) {
        this.socket.emit('send_candidate', candidate)

    }

    public sendDescription(description: RTCSessionDescriptionInit) {
        this.socket.emit('send_description', description)
    }

    public onNewCandidate(cb: any) {
        this.socket.on('remote_candidate', (candidate: RTCIceCandidate) => {
            cb(candidate);
        });
    }

    public onNewDescription(cb: any) {
        this.socket.on('remote_description', (description: RTCSessionDescriptionInit) => {
            cb(description);
        });
    }
    public onNewConnection(cb: any) {
        this.socket.on('new_connection', () => {
            cb();
        });
    }

}

export default SocketHandler;
