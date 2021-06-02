import React from 'react';
import '../../App.scss';

class Definition extends React.Component {
    render() {
        if (this.props.defnsList[0].startsWith("See ")) {
            this.defnsList = this.props.defnsList.slice(1);
        } else this.defnsList = this.props.defnsList;

        return (
            <div className="Definition">
                <ol>
                    {this.defnsList.map((defn) => <li>{defn}</li>)}
                </ol>
            </div>
        );
    }
}

export default Definition;