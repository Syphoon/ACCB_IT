import React, { useEffect, useState } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import Alert from "src/components/notifications/Alert";
import LoadingScreen from '../Loading';


interface IGradient  {
	colors: [string, string, string],
	children: any,
	style?: any,
	loading?: boolean,
}

const Gradient: React.FC<IGradient> = ({ colors, children, style, loading = false }) => {

	return (
		<LinearGradient style={{
			display: "flex",
			flexDirection: "column",
			justifyContent: "center",
			alignItems: "center",
			flex: 1,
			...style,
		}} colors={colors}>
			<Alert />
			{loading ? <LoadingScreen /> : children}
		</LinearGradient>
	);
};

export default Gradient;
