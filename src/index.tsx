import React from 'react';
import { StatusBar } from 'react-native';

// import AppProvider from './hooks';
import Routes from './routes';

const App: React.FC = () => (
	<Routes>
		<StatusBar
			translucent
			barStyle="dark-content"
			backgroundColor="transparent"
		/>
	</Routes>
);

export default App;
