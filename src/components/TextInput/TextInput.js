
import React from 'react';
import InputText from '../InputText/InputText';
import SearchedText from '../SearchedText/SearchedText';

class TextInput extends React.Component {
    constructor() {
		super();
		this.state = { searched: false, searchedText: "" };
		this.toggleSearch = this.toggleSearch.bind(this);
	}

	toggleSearch(text) {
		this.setState(state => ({
			searched: !state.searched,
			searchedText: text
		}));
	}
    
    render() {
        return this.state.searched ? (
            <div className="TextInput">
                <SearchedText text={this.state.searchedText}
                    returnToSearch={_ => this.toggleSearch("")}>
                </SearchedText>
            </div>
        ) : (
            <div className="TextInput">
                <header className="App-header">
                    <InputText submitSearch={this.toggleSearch}></InputText>
                </header>
            </div>
        );
    }
}

export default TextInput;