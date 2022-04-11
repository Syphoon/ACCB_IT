import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';

import { AlertProvider } from "src/contexts/Alert";
import { FormProvider } from './contexts/Form';
import Routes from './routes';

const App: React.FC = () => (
	<AlertProvider>
		<FormProvider>
			<Routes />
		</FormProvider>
	</AlertProvider>
);

export default App;
