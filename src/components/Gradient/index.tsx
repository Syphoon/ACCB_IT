import React, { useEffect, useState } from 'react';
import LinearGradient from 'react-native-linear-gradient';


interface IGradient  {
	colors: [],
	Children: any,
}

const Gradient: React.FC<IGradient> = ({colors ,Children,}) => {

	return (
		<LinearGradient colors={colors}>
			<Children />
		</LinearGradient>
	);
};

export default Gradient;
