import { Route, Switch } from 'wouter';
import HomePage from './components/HomePage/HomePage';

function App() {
	return (
		<Switch>
			<Route
				path='/'
				component={HomePage}
			/>
		</Switch>
	);
}

export default App;
