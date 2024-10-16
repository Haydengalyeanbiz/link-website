import { Route, Switch } from 'wouter';
import HomePage from './components/HomePage/HomePage';
import AffiliateLinkForm from './components/AffiliateLinkForm/AffiliateLinkForm';

function App() {
	return (
		<Switch>
			<Route
				path='/'
				component={HomePage}
			/>
			<Route
				path='/add-post'
				component={AffiliateLinkForm}
			/>
		</Switch>
	);
}

export default App;
