import * as React from 'react';
import SocketHandler from "./api";
import './App.css';
import logo from './logo.svg';

class App extends React.Component {
    public state: any;
    public room: string;
    public socket = SocketHandler.getInstance();
    constructor(props: any) {
        super(props);
        this.state = {
            message: ""
        };
        this.onInput = this.onInput.bind(this);
        this.room = props.match.params.id;

    }

    public componentDidMount() {
        this.socket.connect(this.room);
        this.socket.receive((message: string) => {
            this.setState({
                message
            })
        });
    }

    public render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h1 className="App-title">{this.state.message}</h1>
                    <input type={"text"} onInput={this.onInput}/>
                </header>
                <p className="App-intro">
                    To get started, edit <code>src/App.tsx</code> and save to reload.
                </p>
            </div>
        );
    }

    private onInput(event: any) {
        this.socket.send(event.target.value);
    }
}

export default App;
