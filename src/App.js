import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
    render() {
        return ( 
            <div className="App">
                <header className= "App-header">
                    <img src = { logo } className="App-logo" alt="logo" />
                    <h1 className="App-title"> Mentions Component </h1>  
                </header> 
                <p className="App-intro">
                    Start typing in the textbox, select a suggestion whenever you write @ + a letter. 
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
            txt: "hola @daniel cómo estás?", //Dummy text and mentions
            mentions: ["@daniel"],
            suggestions: [],
            selectionEnd: 0
        };
        this.textInput = null;
    }

    update(e) {
        const selectionEnd = this.textInput.selectionEnd;
        this.setState({txt: e.target.value, suggestions: []});

        //Gets the @\w+ from the text, to see which mention is being written.
        let mentionsFromText = e.target.value.match(/@\w+/g) || [];        
        
        // Verify if a new mention is being written.
        if (mentionsFromText.length > this.state.mentions.length) {

            // Adding a mention, must display suggestions.
            // Get suggestions from somewhere starting with the letter next to @.
            var mentionBeingWritten = (this.textInput.value.substr(0, this.textInput.selectionEnd)
            .match(/@\w+/g) || [])
            .reverse()[0]
            .substr(1);
            
            // Call Github's API
            console.log(`https://api.github.com/search/users?q=${mentionBeingWritten}+in%3Alogin&type=Users`)
            fetch(`https://api.github.com/search/users?q=${mentionBeingWritten}+in%3Alogin&type=Users`)
                .then(resp => resp.json())
                .then(jsonResp => {                    
                    let suggestions = jsonResp.items.map(user => user.login)

                    // Add selected suggestion to the mentions array.
                    this.setState({suggestions: suggestions, selectionEnd: this.textInput.selectionEnd})
                })
        
        } else {            
            // Removing mention or just adding some text.
            var replaceText = true;
            
            // Intersect the mentions in the text with the ones in the state.
            this.state.mentions.forEach(m => {
                
                //This means the user is removing the mention m from the state and the text.
                if (!mentionsFromText.includes(m)) {
                    replaceText = false;
                    
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
        let mention = "@" + e.target.innerHTML.trim();

        // Add selected mention to the state and reset suggestions.
        this.setState({mentions: this.state.mentions.concat([mention]), suggestions: []});        

        // Update the text to show the selected mention
        let txt = this.state.txt;

        // Gets the length of the partial mention to replace it when the actual one is selected
        let partialMentionsLength = (txt.substr(0, this.textInput.selectionEnd)
        .match(/@\w+/g) || [])
        .reverse()[0]
        .substr(1)
        .length

        //To replace, the section between partialMentionsLength and selectionEnd
         let updatedText = txt.slice(0, this.state.selectionEnd - partialMentionsLength) + 
              e.target.innerHTML.trim() + ' ' + txt.slice(this.state.selectionEnd, txt.length);

        this.setState({txt: updatedText, selectionEnd: this.state.selectionEnd + e.target.innerHTML});
        this.textInput.focus();
        this.textInput.selectionEnd = this.state.selectionEnd;       
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