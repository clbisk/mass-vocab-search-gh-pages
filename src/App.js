import React from 'react';
import TextInput from './components/TextInput/TextInput';
import ImageInput from './components/ImageInput/ImageInput';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.scss';

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
