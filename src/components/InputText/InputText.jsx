import React from 'react';
import TracauShoutout from '../TracauShoutout/TracauShoutout';
import './InputText.scss';
import '../../App.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

class InputText extends React.Component {
    constructor() {
        super()
        this.state = {text: ""};
    }

    detectHotkeySubmit(event, curText) {
        if (event.shiftKey && event.key === "Enter") {
            this.props.submitSearch(curText);
        }
    }

    render() {
        return (
            <div className="InputText">
                <div className="main-content">
                    <div>Enter text: </div>
                    <div className="upper-flex" onKeyPress = { event => this.detectHotkeySubmit(event, this.state.text) }>
                        <textarea className="big-textbox"
                            value = {this.state.text}
                            onChange = { event => this.setState({ text: event.target.value }) }></textarea>
                        <FontAwesomeIcon icon={faSearch} onClick={_ => this.props.submitSearch(this.state.text)} />
                    </div>
                </div>

                <TracauShoutout></TracauShoutout>
            </div>
        );
    }
}

export default InputText;