import React, { useEffect, useState } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import Alert from "src/components/notifications/Alert";


interface IGradient  {
	colors: [string, string, string],
	children: any,
	style?: any,
}

const Gradient: React.FC<IGradient> = ({colors ,children,style}) => {

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
			{children}
		</LinearGradient>
	);
};

export default Gradient;
