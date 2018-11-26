import * as React from 'react';
import LocalMediaHandler from "../api/LocalMediaHandler";
import SocketHandler from "../api/SocketHandler";
import './Video.css';

// tslint:disable:no-console

interface IPropsVideo {
    counter: string;
    room: string;
}

class Video extends React.Component <IPropsVideo, {}>{
    private videoRef: React.RefObject<HTMLVideoElement> = React.createRef();
    private containerRef: React.RefObject<HTMLDivElement> = React.createRef();
    private localStream: MediaStream;
    private localMediaHandler: LocalMediaHandler;
    private socket = SocketHandler.getInstance();
    constructor(props: IPropsVideo) {
        super(props);
        this.gotStream = this.gotStream.bind(this);
        this.getDescription = this.getDescription.bind(this);
        this.getCandidate = this.getCandidate.bind(this);
    }

    public componentDidMount() {
        navigator.mediaDevices
            .getUserMedia({
                audio: true,
                video: true
            })
            .then(this.gotStream)
            .catch(e => console.log('getUserMedia() error: ', e));
    }

    public render() {
        return (
            <div>
                <video
                    id="video1"
                    className={'Video'}
                    ref={this.videoRef}
                    playsInline={true}
                    autoPlay={true}
                    muted={true}>
                    No soporta video
                </video>
                <div ref={this.containerRef}>&nbsp;</div>
            </div>
        );
    }

    private getCandidate(iceCandidate: RTCIceCandidate) {
        console.log('Video => onNewCandidate');
        this.localMediaHandler.addCandidate(iceCandidate);
    }

    private getDescription(description: RTCSessionDescriptionInit) {
        if (!!this.localMediaHandler) {
            this.localMediaHandler.createAnswer(description);
        } else {
            console.log('Video => onNewDescription');
            const video: HTMLVideoElement = document.getElementById('video2') as HTMLVideoElement
                || this.createVideo('2');
            this.localMediaHandler = new LocalMediaHandler(
                this.socket,
                video,
                this.localStream);
            this.localMediaHandler.addTrack();
            this.localMediaHandler.createOffer();
            this.localMediaHandler.createAnswer(description);
        }
    }

    private createVideo(counter: string) {
        console.log('Video => createVideo');
        const video = document.createElement('video');
        video.className = 'Video';
        video.id = 'video2';
        video.autoplay=true;
        video.muted=true;
        if (this.containerRef.current) {
            this.containerRef.current.appendChild(video);
        }
        return video;
    }

    private gotStream(stream: MediaStream) {
        console.log('Video => gotStream');
        if (this.videoRef.current) {
            this.videoRef.current.srcObject = stream;
            this.localStream = stream;
            this.socket.connect(this.props.room);
            console.log('Video => onNewConnection counter', this.props.counter);
            this.socket.onNewConnection(() => {
                console.log('Video => onNewConnection counter', this.props.counter);
                if (parseInt(this.props.counter, 10) < 2) {
                    console.log('Video => onNewConnection');
                    const video = this.createVideo('2');
                    this.localMediaHandler = new LocalMediaHandler(
                        this.socket,
                        video,
                        this.localStream);
                    this.localMediaHandler.addTrack();
                    this.localMediaHandler.createOffer();
                }
            });
            this.socket.onNewDescription(this.getDescription);
            this.socket.onNewCandidate(this.getCandidate);
        }
    }

}

export default Video;
