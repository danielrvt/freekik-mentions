import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
    render() {
        return ( 
            <div className="App">
                <header className= "App-header">
                    <img src = { logo } className="App-logo" alt="logo" />
                    <h1 className="App-title"> Welcome to React</h1>  
                </header> 
                <p className="App-intro">
                    To get started, edit < code > src / App.js </code> and save to reload. 
                </p>
                <MentionInput> </MentionInput>
            </div>
        );
        }
    }

class MentionInput extends Component {

    constructor() {
        super();
        this.state = {
            txt: "hola @arturo cómo estás?",
            mentions: ["@arturo"]
        };
    }

    update(e) {
        let mentionsFromText = e.target.value.match(/@\w+/g) || [];
        // Verify if a new mention is being written.

        if (mentionsFromText.length > this.state.mentions.length) {
            console.log("Agregando mention, dar sugerencias");
        } else {            
            console.log("Agregando texto o borrando mention")
            var replaceText = true;
            // Comparar los mentions con los matchs, intersectar los dos conjuntos.
            this.state.mentions.forEach(m => {
                if (!mentionsFromText.includes(m)) {
                    replaceText = false;
                    // Eliminar mention del estado y del texto                    
                    console.log(this.state.mentions.filter((m) => { mentionsFromText.includes(m) }));
                    this.setState({
                        txt: this.state.txt.replace(m, ''),
                        mentions: this.state.mentions.filter((m) => { mentionsFromText.includes(m) })
                    })
                }
            })
            console.log(this.state.mentions);               
            if (replaceText) this.setState({txt: e.target.value});
        }
    }

    render () {        
        return (
            <input value={this.state.txt} onChange={this.update.bind(this)} />
        );
    }
}

    export default App;