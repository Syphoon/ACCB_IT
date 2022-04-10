import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Login from "src/pages/Login";
import Dashboard from "src/pages/Dashboard";
import Splash from "src/pages/Splash";
import Coleta from "src/pages/Coleta";
import Form from "src/pages/Coleta/Form";


const App = createNativeStackNavigator ();

const AppRoutes: React.FC = () => {
	return (
		<NavigationContainer>
			<App.Navigator
				screenOptions={{
					headerTitleAlign: 'center',
					headerShown: false,
				}}
			>
				<App.Screen name="Dashboard" component={Dashboard} />
				<App.Screen name="Splash" component={Splash} />
				<App.Screen name="Login" component={Login} />
				{/* <App.Screen name="Coleta" component={Coleta} /> */}
				{/* <App.Screen name="Form" component={Form} /> */}
			</App.Navigator>
		</NavigationContainer>
	);
};

export default AppRoutes;
