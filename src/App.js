import React from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import './App.scss';
import ImageInput from './components/ImageInput/ImageInput';
import TextInput from './components/TextInput/TextInput';

class App extends React.Component {

	render() {
		return (
			<div className="App">
				<Router>
					<Switch>
						<Route path="/text" component={TextInput} />
						<Route path="/img" component={ImageInput} />
						<Route exact path="/" component={TextInput} />
					</Switch>
				</Router>
			</div>
		);
	}
}

export default App;
