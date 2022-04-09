import React, { useEffect, useState } from 'react';
import LinearGradient from 'react-native-linear-gradient';


interface IGradient  {
	colors: [string, string, string],
	children: any,
}

const Gradient: React.FC<IGradient> = ({colors ,children,}) => {

	return (
		<LinearGradient style={{
			display: "flex",
			flexDirection: "column",
			justifyContent: "center",
			alignItems: "center",
			flex: 1,
		}} colors={colors}>
			{children}
		</LinearGradient>
	);
};

export default Gradient;
