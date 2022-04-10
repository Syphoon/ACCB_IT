import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';

import { AlertProvider } from "src/contexts/Alert";
import Routes from './routes';

const App: React.FC = () => (
	<AlertProvider>
		<Routes />
	</AlertProvider>
);

export default App;
