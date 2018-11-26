import * as React from 'react';
import SocketHandler from "./api/SocketHandler";
import './App.css';
import logo from './logo.svg';
import Video from "./Video/Video";

interface IStateApp {
    count: string;
    message: string;
}
class App extends React.Component <{}, IStateApp>{
    public state: IStateApp;
    public room: string;
    public socket = SocketHandler.getInstance();
    constructor(props: any) {
        super(props);
        this.state = {
            count: "",
            message: ""
        };
        this.onInput = this.onInput.bind(this);
        this.room = props.match.params.id;

    }

    public componentDidMount() {
        this.socket.count((count: string) => { this.setState({ count })});
        this.socket.receive((message: string) => {
            this.setState({
                message
            })
        });
        this.socket.callCount();
    }

    public componentWillUnmount() {
        this.socket.count((count: string) => {
            this.setState({
                count
            })
        });
    }

    public render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h1 className="App-title">{this.state.message} {this.state.count}</h1>
                    <input type={"text"} onInput={this.onInput}/>
                </header>
                <p className="App-intro">
                    <Video counter={this.state.count} room={this.room}/>
                </p>
            </div>
        );
    }

    private onInput(event: any) {
        this.socket.send(event.target.value);
    }
}

export default App;
