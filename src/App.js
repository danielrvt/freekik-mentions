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
            mentions: ["@daniel"],
            suggestions: []
        };
        this.textInput = null;
    }

    update(e) {
        //Gets the @\w+ from the text, to see which mention is being written.
        let mentionsFromText = e.target.value.match(/@\w+/g) || [];
        
        // Verify if a new mention is being written.
        if (mentionsFromText.length > this.state.mentions.length) {
            console.log("caso add", mentionsFromText, this.state.mentions)
            // Adding a mention, must display suggestions.
            // TODO: Get suggestions from somewhere...
            
            let suggestions = ["daniel", "arturo", "daniela"];

            // Add selected suggestion to the mentions array.
            this.setState({suggestions: suggestions})

        } else {            
            // Removing mention or just adding some text.
            var replaceText = true;
            
            // Intersect the mentions in the text with the ones in the state.
            this.state.mentions.forEach(m => {
                
                //This means the user is removing the mention m from the state and the text.
                if (!mentionsFromText.includes(m)) {
                    replaceText = false;
                   
                    console.log("REMOVE", this.state.mentions.filter((m) => { 
                       return mentionsFromText.includes(m) 
                    }))
                    
                    this.setState({
                        txt: this.state.txt.replace(m, ''),
                        mentions: this.state.mentions.filter((m) => { return mentionsFromText.includes(m) })
                    })
                }
            })
            
            // If the input text was updated, update the state.
            if (replaceText) this.setState({txt: e.target.value, suggestions: []});
        }
    }

    clickHandler(e) {
        console.log("click", e.target.innerHTML, this.textInput.selectionStart)
        let mention = "@" + e.target.innerHTML;

        // Add selected mention to the state and reset suggestions.
        this.setState({mentions: this.state.mentions.concat([mention])});        
        this.setState({suggestions: []})

        // Update the text to show the selected mention
        let txt = this.state.txt;
        let updatedText = txt.slice(0, this.textInput.selectionStart) + 
            e.target.innerHTML + ' ' + txt.slice(this.textInput.selectionStart + 1, txt.length);
        this.setState({txt: updatedText});

        this.setState({suggestions: []});
        this.textInput.focus();
    }

    render () {        
        return (
            <div>
                <textarea ref={(input) => { this.textInput = input; }}
                    cols="100"
                    rows="5"
                    value={this.state.txt} 
                    onChange={this.update.bind(this)} />
                <SuggestionsList 
                    clickHandler={this.clickHandler.bind(this)}
                    suggestions={this.state.suggestions}>
                </SuggestionsList>
            </div>
        );
    }
}

class SuggestionsList extends Component {
    render () {
        const suggestions = this.props.suggestions.map(s => <Suggestion clickHandler={this.props.clickHandler} key={s}>{s}</Suggestion>);

        return <ul>
            {suggestions}
        </ul>
    }
}

class Suggestion extends Component {
    render() {
        return <li onClick={this.props.clickHandler}>{this.props.children}</li>
    }
}

    export default App;