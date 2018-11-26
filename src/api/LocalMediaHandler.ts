import SocketHandler from "./SocketHandler";
// tslint:disable:no-console

class LocalMediaHandler {
    private server: RTCConfiguration = {
        iceServers: [
            {urls: ['stun:stun.l.google.com:19302']}
        ]
    };
    private pc: RTCPeerConnection;
    private socketHandler: SocketHandler;
    private video: HTMLVideoElement;
    private stream: MediaStream;
    private offerOptions: RTCOfferOptions = {
        offerToReceiveAudio: true,
        offerToReceiveVideo: true
    };

    constructor(socketHandler: SocketHandler, video: HTMLVideoElement, stream: MediaStream) {
        console.log('LocalMediaHandler --> constructor');
        this.socketHandler = socketHandler;
        this.video = video;
        this.stream = stream;
        this.addTrack = this.addTrack.bind(this);
        this.createAnswer = this.createAnswer.bind(this);
        this.onCreateOfferSuccess = this.onCreateOfferSuccess.bind(this);
        this.onCreateOfferError = this.onCreateOfferError.bind(this);
        this.pc = new RTCPeerConnection(this.server);
        this.pc.onicecandidate = this.onIceCandidate.bind(this);
        this.pc.ontrack = this.onTrack.bind(this);
    }


    public addTrack() {
        this.stream.getTracks().forEach((track: MediaStreamTrack) => {
            this.pc.addTrack(track, this.stream);
        });
        console.log('LocalMediaHandler --> addTrack')
    }

    public createOffer() {
        this.pc
            .createOffer(this.offerOptions)
            .then(this.onCreateOfferSuccess)
            .catch(this.onCreateOfferError);
    }

    public createAnswer(newDescription: RTCSessionDescriptionInit) {
        console.log('LocalMediaHandler --> createAnswer', newDescription);
        if (newDescription.type === 'offer') {
            this.pc.setRemoteDescription(newDescription)
        } else {
            this.pc.setRemoteDescription(newDescription);
            this.pc.createAnswer()
                .then((description: RTCSessionDescriptionInit) => {
                    console.log('LocalMediaHandler --> createAnswer then', description);
                    this.pc.setLocalDescription(description);
                    this.socketHandler.sendDescription(description);
                })
                .catch((error: any) => {
                    console.log('LocalMediaHandler --> createAnswer ERRROR', error);
                })
        }

    }

    private onCreateOfferSuccess(description: RTCSessionDescriptionInit) {
        console.log('LocalMediaHandler --> onCreateOfferSuccess');
        this.pc.setLocalDescription(description)
            .then(() => {
                console.log('LocalMediaHandler --> setLocalDescription ');
                this.socketHandler.sendDescription(description);
            })
            .catch((error: any) => {
                console.log('LocalMediaHandler --> setLocalDescription error');
            })
    }

    get peerConnection(): RTCPeerConnection {
        return this.pc;
    }

    private onIceCandidate(event: RTCPeerConnectionIceEvent) {
        console.log('LocalMediaHandler --> onIceCandidate', event.candidate);
        if(event.candidate != null) {
            console.log('LocalMediaHandler --> onIceCandidate THIS CANDIDATE', event.candidate);
            this.socketHandler.sendCandidate(event.candidate);
        }
    }

    private onTrack(event: RTCTrackEvent) {
        console.log('LocalMediaHandler --> onTrack');
        if (this.video.srcObject !== event.streams[0]) {
            this.video.srcObject = event.streams[0];
        }
    }

    private onCreateOfferError(error: any) {
        console.log('LocalMediaHandler --> onCreateOfferError');
    }

}

export default LocalMediaHandler;
