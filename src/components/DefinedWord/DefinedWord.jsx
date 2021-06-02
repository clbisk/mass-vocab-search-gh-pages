import React from 'react';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import '../../App.scss';
import Definition from '../Definition/Definition';

class DefinedWord extends React.Component {
    render() {
        const popover = (
            <Popover id={this.props.word}>
                <Popover.Title as="h3">{this.props.word}</Popover.Title>
                <Popover.Content>
                    <Definition defnsList={this.props.defn} />
                </Popover.Content>
            </Popover>
        );

        return (
            <div className="DefinedWord">
                <OverlayTrigger
                    key={this.props.word}
                    placement='top'
                    overlay={popover}
                >
                    <div>{this.props.word}</div>
                </OverlayTrigger>
            </div>
        );
    }
}

export default DefinedWord;