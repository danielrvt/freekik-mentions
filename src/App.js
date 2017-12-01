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
            txt: "hola @daniel cómo estás?",
            mentions: ["@daniel"]
        };
    }

    update(e) {
        let mentionsFromText = e.target.value.match(/@\w+/g) || [];
        
        // Verify if a new mention is being written.
        if (mentionsFromText.length > this.state.mentions.length) {
            // Adding a mention, must display suggestions.
            console.log("Agregando mention, dar sugerencias");            
        } else {            
            // Removing mention or just adding some text.
            var replaceText = true;
            
            // Intersect the mentions in the text with the ones in the state.
            this.state.mentions.forEach(m => {
                // This means the user is removing the mention m from the state and the text.
                if (!mentionsFromText.includes(m)) {
                    replaceText = false;
                   
                    this.setState({
                        txt: this.state.txt.replace(m, ''),
                        mentions: this.state.mentions.filter((m) => { mentionsFromText.includes(m) })
                    })
                }
            })
            
            // If the input text was updated, update the state.
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